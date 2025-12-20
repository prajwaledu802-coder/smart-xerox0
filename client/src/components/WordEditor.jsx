import { useState, useEffect, useRef } from 'react';
import { X, Save, Loader, Eye, FileText, Type, FileOutput, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';
import { renderAsync } from 'docx-preview';
import mammoth from 'mammoth'; // Fallback Engine
import { asBlob } from 'html-docx-js-typescript';
import { toast } from 'sonner';

const WordEditor = ({ file, isOpen, onClose, onSave, onPageCountUpdate, readOnly = false }) => {
    const [renderMode, setRenderMode] = useState('high-fi'); // 'high-fi' or 'fast'
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const editorRef = useRef(null);
    const renderIdRef = useRef(0); // For handling stale renders

    useEffect(() => {
        if (isOpen && file) {
            loadFile(renderMode);
        } else {
            if (editorRef.current) editorRef.current.innerHTML = '';
        }
    }, [isOpen, file, renderMode]);

    const loadFile = async (mode) => {
        const myId = ++renderIdRef.current;
        setLoading(true);
        if (editorRef.current) editorRef.current.innerHTML = '';

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Stale Check 1
            if (myId !== renderIdRef.current) return;

            if (mode === 'high-fi') {
                // STRATEGY 1: High Fidelity (docx-preview)
                // We use standard settings for maximum stability
                const blob = new Blob([arrayBuffer]);

                await renderAsync(blob, editorRef.current, null, {
                    className: "docx_viewer",
                    inWrapper: true,
                    ignoreWidth: false,
                    experimental: true,      // NATIVE FIDELITY
                    useBase64URL: true,
                    padding: "20px"
                });

                // Stale Check 2
                if (myId !== renderIdRef.current) return;

                // Check if it actually rendered something
                if (editorRef.current.childNodes.length === 0) {
                    throw new Error("High Fidelity Render produced empty output.");
                }

                // EXACT PAGE COUNT CALCULATION
                setTimeout(() => {
                    if (myId !== renderIdRef.current) return;
                    if (editorRef.current) {
                        const contentHeight = editorRef.current.scrollHeight;
                        const detectedPages = Math.max(1, Math.ceil(contentHeight / 1100));
                        console.log("Measured Height:", contentHeight, "Pages:", detectedPages);

                        if (onPageCountUpdate) {
                            onPageCountUpdate(detectedPages);
                        }
                    }
                }, 1000);

                toast.success("Loaded High Fidelity Preview");
            } else {
                // STRATEGY 2: Fast / Text Mode (mammoth)
                const result = await mammoth.convertToHtml({ arrayBuffer });
                if (myId !== renderIdRef.current) return;

                if (!result.value) throw new Error("Empty document.");

                editorRef.current.innerHTML = `
                    <div class="prose max-w-none text-black p-10 bg-white shadow-lg min-h-[297mm] w-[210mm] mx-auto">
                        ${result.value}
                    </div>
                `;
                toast.success("Loaded Compatibility Mode");
            }

        } catch (error) {
            if (myId !== renderIdRef.current) return;
            console.error("Render Error:", error);

            if (mode === 'high-fi') {
                console.log("High-Fi Failed. Retrying with Standard Mode...");
                toast.error("Format too complex. Switching to Text Mode...");
                setRenderMode('fast');
            } else {
                editorRef.current.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-10 text-red-500 bg-white rounded-xl shadow-lg">
                        <AlertTriangle size={40} class="mb-2"/>
                        <p class="font-bold">Could not read document.</p>
                        <p class="text-sm">${error.message}</p>
                    </div>
                `;
            }
        } finally {
            if (myId === renderIdRef.current) {
                setLoading(false);
            }
        }
    };

    const handleConvertToPdf = async () => {
        setSaving(true);
        let container = null;
        try {
            const html2pdf = (await import('html2pdf.js')).default;

            // Find the wrapper created by docx-preview
            const content = editorRef.current.querySelector('.docx-wrapper') || editorRef.current;

            // Deep Clone
            const element = content.cloneNode(true);

            // Create a reusable container for the Viewport Snapshot strategy
            container = document.createElement('div');

            // Styling: VISIBLE OVERLAY strategy
            // We overlay the document entirely to ensure correct rendering for screenshot
            container.style.position = 'fixed';
            container.style.left = '0';
            container.style.top = '0';
            container.style.width = '100vw'; // Full width
            container.style.height = '100vh';
            container.style.overflow = 'auto'; // Scrollable
            container.style.zIndex = '99999'; // Top of everything
            container.style.backgroundColor = '#525659';
            container.style.padding = '40px';
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';

            // Add text to inform user
            const label = document.createElement('div');
            label.innerText = "Generating PDF... Please Wait";
            label.style.cssText = "margin-bottom: 20px; color: white; background: black; padding: 10px 20px; border-radius: 8px; font-weight: bold;";
            container.appendChild(label);

            // Set explicit width on content clone to match A4
            element.style.width = '210mm';
            element.style.background = 'transparent';

            container.appendChild(element);
            document.body.appendChild(container); // Mount to DOM

            // Clean up clone styles that might interfere
            const pages = container.querySelectorAll('section.docx-page');
            pages.forEach(p => {
                p.style.margin = '0 auto';
                p.style.marginBottom = '20px'; // Keep gaps for visual check
                p.style.boxShadow = 'none';
            });

            await new Promise(resolve => setTimeout(resolve, 2000)); // Visible wait

            const opt = {
                margin: 0,
                filename: file.name.replace(/\.(docx|doc)$/, '.pdf'),
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    scrollY: 0,
                    windowWidth: 1024
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Use the ELEMENT inside the container, not the container itself (to avoid capturing the label)
            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            const newFile = new File([pdfBlob], opt.filename, { type: 'application/pdf' });

            onSave(newFile);
            onClose();
            toast.success("PDF Conversion Complete!");

        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Conversion failed.");
        } finally {
            if (container && container.parentNode) container.parentNode.removeChild(container);
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4">
            <div className="bg-gray-100 dark:bg-gray-950 w-full h-full max-w-7xl max-h-screen sm:max-h-[95vh] rounded-none sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">

                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm z-20">
                    <div>
                        <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <Type className="text-blue-600" /> Word Viewer
                        </h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 font-medium">{file?.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${renderMode === 'high-fi' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {renderMode === 'high-fi' ? 'High Fidelity' : 'Basic Text'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-900 p-8 flex justify-center relative custom-scrollbar">
                    {loading && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
                            <Loader size={48} className="animate-spin mb-4 text-blue-600" />
                            <p className="font-bold text-lg text-gray-800 dark:text-white">Parsing Document...</p>
                        </div>
                    )}

                    {/* Container */}
                    <div
                        className={`transition-all relative w-full flex justify-center ${renderMode === 'fast' ? '' : ''}`}
                    >
                        <div
                            ref={editorRef}
                            style={{ width: '100%' }}
                            className="flex flex-col items-center"
                        />

                        <style>{`
                            /* Compatibility Mode */
                            .prose { color: black !important; }
                            
                            /* High-Fi Container Layout ONLY */
                            .docx_viewer { 
                                background-color: #525659 !important; /* Standard Dark Backdrop */
                                padding: 20px !important; 
                                min-height: 100%; 
                                display: flex; 
                                flex-direction: column; 
                                align-items: center; 
                            }
                            /* NO OTHER OVERRIDES - PURE NATIVE RENDER */
                        `}</style>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end items-center z-20 gap-4">
                    <button
                        onClick={handleConvertToPdf}
                        disabled={loading}
                        className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <FileOutput size={18} /> Convert to PDF
                    </button>
                    <button onClick={onClose} className="px-6 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WordEditor;
