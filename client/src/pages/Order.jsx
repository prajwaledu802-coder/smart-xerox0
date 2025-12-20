import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import useStore from '../store/useStore';
import api from '../utils/api';
import { Upload, FileText, X, Info, Printer, Copy, File, Plus, Trash2, ShoppingCart, AlertCircle, Edit, Sparkles, Scissors, Monitor, Eye, FileOutput, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PdfEditor from '../components/PdfEditor';
import WordEditor from '../components/WordEditor';

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure worker locally - MOVED to useEffect to prevent boot crash
// pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const Order = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useStore();

    // Initialize PDF Worker safely on mount
    useState(() => {
        try {
            if (typeof window !== 'undefined') {
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
            }
        } catch (e) {
            console.error("PDF Lib Init Error:", e);
        }
    });

    // Current Item State
    const [currentFile, setCurrentFile] = useState(null);
    const [currentSettings, setCurrentSettings] = useState({
        printType: 'bw',
        sides: 'single', // New State for Sides
        copies: 1,
        pages: 0
    });

    // Editor State
    const [editorFile, setEditorFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);

    // Word Editor State
    const [wordEditorFile, setWordEditorFile] = useState(null);
    const [wordPreviewFile, setWordPreviewFile] = useState(null);

    // Cart / List State
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Module State
    const [activeModule, setActiveModule] = useState('pdf'); // 'pdf' or 'word'

    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setCurrentFile(selected);

            // Default
            let realPageCount = 1;

            try {
                if (selected.type === 'application/pdf') {
                    const arrayBuffer = await selected.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
                    const pdf = await loadingTask.promise;
                    realPageCount = pdf.numPages;
                    toast.info(`Detected ${realPageCount} pages (PDF).`);
                } else if (selected.name.endsWith('.docx') || selected.name.endsWith('.doc')) {
                    // Advanced Heuristic: Word Count
                    try {
                        const arrayBuffer = await selected.arrayBuffer();
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        const text = result.value || "";
                        const wordCount = text.split(/\s+/).length;

                        // Roughly 500 words per page (Standard Academic Page)
                        realPageCount = Math.max(1, Math.ceil(wordCount / 500));
                        toast.info(`Estimated ~${realPageCount} pages (${wordCount} words).`);
                    } catch (mErr) {
                        console.warn("Mammoth count failed, falling back to size", mErr);
                        realPageCount = Math.ceil(selected.size / 100000);
                    }
                }
            } catch (err) {
                console.error("Page detection error:", err);
                toast.error("Could not detect pages automatically.");
                realPageCount = 1;
            }

            setCurrentSettings(s => ({ ...s, pages: realPageCount }));
        }
    };

    const handleSaveEditedFile = (newFile) => {
        setCurrentFile(newFile);
        toast.success("Document updated successfully!");
        setEditorFile(null);
        setWordEditorFile(null);
    };

    const calculateItemCost = (settings) => {
        const pages = settings.pages > 0 ? settings.pages : 1;
        const copies = settings.copies;

        let costPerSet = 0;

        if (settings.printType === 'bw') {
            if (settings.sides === 'single') {
                // B&W Single: ₹3 per page
                costPerSet = pages * 3;
            } else {
                // B&W Double: ₹4 per sheet (2 pages)
                const sheets = Math.ceil(pages / 2);
                costPerSet = sheets * 4;
            }
        } else {
            // Color
            if (settings.sides === 'single') {
                // Color Single: ₹5 per page
                costPerSet = pages * 5;
            } else {
                // Color Double: ₹10 per sheet (2 pages)
                // User said "front and Backpage 10 rs" -> implies per sheet
                const sheets = Math.ceil(pages / 2);
                costPerSet = sheets * 10;
            }
        }

        return costPerSet * copies;
    };

    const addToCart = () => {
        if (!currentFile) return;

        const newItem = {
            id: Date.now(),
            file: currentFile,
            ...currentSettings,
            cost: calculateItemCost(currentSettings)
        };

        setCart([...cart, newItem]);

        // Reset current selection
        setCurrentFile(null);
        setCurrentSettings({ printType: 'bw', sides: 'single', copies: 1, pages: 0 });
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const calculateGrandTotal = () => {
        return cart.reduce((acc, item) => acc + item.cost, 0);
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) return;
        setError(null);
        setLoading(true);

        try {
            console.log("Submitting order with items:", cart);
            const formData = new FormData();

            // Append all files
            cart.forEach((item) => {
                formData.append('files', item.file);
            });

            // Append order metadata as JSON
            const orderData = cart.map(item => ({
                printType: item.printType,
                copies: item.copies,
                pages: item.pages,
                amount: item.cost
            }));

            formData.append('orderData', JSON.stringify(orderData));
            formData.append('userId', user?.id || 'guest');
            formData.append('amountTotal', calculateGrandTotal());
            formData.append('instruction', "Multi-item order");

            const res = await api.post('/orders', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Order response:", res.data);

            if (res.data.success) {
                toast.success('Order created successfully!');
                navigate('/payment', { state: { order: res.data.order } });
            } else {
                const errMsg = res.data.error || 'Unknown server error';
                setError(errMsg);
                toast.error(errMsg);
            }
        } catch (err) {
            console.error("Order error", err);
            const errMsg = err.response?.data?.error || err.message || 'Order Creation Failed';
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 transition-colors duration-300">
            <PdfEditor
                key={editorFile ? `edit-${editorFile.name}` : 'edit-empty'}
                file={editorFile}
                isOpen={!!editorFile}
                onClose={() => setEditorFile(null)}
                onSave={handleSaveEditedFile}
            />
            <PdfEditor
                key={previewFile ? `view-${previewFile.name}` : 'view-empty'}
                file={previewFile}
                isOpen={!!previewFile}
                onClose={() => setPreviewFile(null)}
                readOnly={true}
            />

            {/* Word Editor Modes */}
            <WordEditor
                key={wordEditorFile ? `edit-word-${wordEditorFile.name}` : 'edit-word'}
                file={wordEditorFile}
                isOpen={!!wordEditorFile}
                onClose={() => setWordEditorFile(null)}
                onSave={handleSaveEditedFile}
                onPageCountUpdate={(count) => setCurrentSettings(s => ({ ...s, pages: count }))}
            />
            <WordEditor
                key={wordPreviewFile ? `view-word-${wordPreviewFile.name}` : 'view-word'}
                file={wordPreviewFile}
                isOpen={!!wordPreviewFile}
                onClose={() => setWordPreviewFile(null)}
                readOnly={true}
                onPageCountUpdate={(count) => setCurrentSettings(s => ({ ...s, pages: count }))}
            />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

                {/* Left Side: Adding Items (3D Card) */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="card-3d p-8 h-fit"
                >
                    <h2 className="text-3xl font-black mb-8 text-gray-800 dark:text-white flex items-center gap-3 text-3d">
                        <Plus size={32} className="text-blue-600" />
                        {t('add_items') || 'Add Items'}
                    </h2>

                    {/* 3D Upload Box */}
                    {/* Module Selection Tabs */}
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8">
                        <button
                            onClick={() => setActiveModule('pdf')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeModule === 'pdf' ? 'bg-white shadow-md text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText size={20} /> {t('pdf_module') || 'PDF Module'}
                        </button>
                        <button
                            onClick={() => setActiveModule('word')}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeModule === 'word' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <MessageCircle size={20} /> {t('doc_module') || 'Document Module'}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="mb-8 min-h-[300px]">
                        {activeModule === 'pdf' ? (
                            // PDF MODULE
                            <>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                {!currentFile ? (
                                    <label htmlFor="file-upload" className="block w-full h-[300px] rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group input-3d hover:shadow-inner relative overflow-hidden bg-white dark:bg-gray-800">
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-24 h-24 card-3d rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-red-500 bg-red-50 dark:bg-red-900/20">
                                                <Upload size={40} />
                                            </div>
                                            <span className="font-black text-gray-800 dark:text-gray-100 text-2xl">{t('upload_pdf_title') || 'Upload PDF'}</span>
                                            <p className="text-gray-400 mt-2 font-medium">{t('browse_files') || 'Click to browse your files'}</p>
                                        </div>
                                    </label>
                                ) : (
                                    <div className="card-3d p-6 border-l-4 border-red-500 relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="truncate flex-1">
                                                    <p className="font-bold text-gray-800 dark:text-white truncate max-w-[200px] text-lg">{currentFile.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-bold text-gray-800 dark:text-white text-lg">{currentSettings.pages}</span>
                                                        <span className="text-sm text-gray-500 font-semibold">Pages {t('detected') || 'detected'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => setCurrentFile(null)} className="p-2 text-red-400 hover:text-red-500 transition-colors">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setPreviewFile(currentFile)}
                                                className="w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                            >
                                                <Eye size={18} /> {t('preview') || 'Preview'}
                                            </button>
                                            <button
                                                onClick={() => setEditorFile(currentFile)}
                                                className="w-full py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                            >
                                                <Edit size={18} /> {t('edit_pages') || 'Edit Pages'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // DOCUMENT MODULE (WORD)
                            <div className="card-3d h-[300px] p-8 flex flex-col items-center justify-center text-center bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                    <MessageCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{t('manual_format') || 'Manual Formatting'}</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 font-medium">
                                    {t('manual_format_desc') || 'Word documents require manual processing to ensure perfect layout. Please verify via WhatsApp.'}
                                </p>
                                <a
                                    href={`https://wa.me/919916220476?text=${encodeURIComponent(`Hi I am ${user?.name || 'User'}. And want help with the Word document.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-8 py-3 bg-[#25D366] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center gap-2"
                                >
                                    <MessageCircle size={20} /> {t('chat_whatsapp') || 'Chat on WhatsApp'}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Settings 3D Inputs */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 block uppercase tracking-wider">{t('print_type') || 'Print Type'}</label>
                            <div className="flex card-3d p-1 rounded-2xl">
                                <button
                                    onClick={() => setCurrentSettings(s => ({ ...s, printType: 'bw' }))}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${currentSettings.printType === 'bw' ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    <span className="block">B&W</span>
                                    <span className="text-[10px] opacity-70">₹3/₹4</span>
                                </button>
                                <button
                                    onClick={() => setCurrentSettings(s => ({ ...s, printType: 'color' }))}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${currentSettings.printType === 'color' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' : 'text-gray-500 hover:text-pink-500'}`}
                                >
                                    <span className="block">Color</span>
                                    <span className="text-[10px] opacity-70">₹5/₹10</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 block uppercase tracking-wider">{t('sides') || 'Sides'}</label>
                            <div className="flex card-3d p-1 rounded-2xl">
                                <button
                                    onClick={() => setCurrentSettings(s => ({ ...s, sides: 'single' }))}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${currentSettings.sides === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-blue-500'}`}
                                >
                                    <span className="block">Single</span>
                                    <span className="text-[10px] opacity-70">Front Only</span>
                                </button>
                                <button
                                    onClick={() => setCurrentSettings(s => ({ ...s, sides: 'double' }))}
                                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${currentSettings.sides === 'double' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-blue-500'}`}
                                >
                                    <span className="block">Double</span>
                                    <span className="text-[10px] opacity-70">Front & Back</span>
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2 grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 block uppercase tracking-wider">{t('copies') || 'Copies'}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={currentSettings.copies}
                                    onChange={(e) => setCurrentSettings(s => ({ ...s, copies: parseInt(e.target.value) || 1 }))}
                                    className="input-3d w-full font-bold text-gray-800 dark:text-white text-center"
                                />
                            </div>
                            {/* Xerox / Special Request Link */}
                            <div className="flex items-end">
                                <a
                                    href={`https://wa.me/919916220476?text=${encodeURIComponent(`Hi, I need Physical Xerox / Custom Order.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-green-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={18} /> Need Xerox?
                                </a>
                            </div>
                        </div>


                        {/* Instructions Field - Added as requested */}
                        <div className="col-span-2">
                            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 block uppercase tracking-wider flex items-center gap-2">
                                <Info size={16} /> {t('special_instr') || 'Special Instructions'}
                            </label>
                            <textarea
                                placeholder={t('instr_placeholder') || "E.g. Spiral Binding, Lamination, Print only odd pages..."}
                                value={currentSettings.instructions || ''}
                                onChange={(e) => setCurrentSettings(s => ({ ...s, instructions: e.target.value }))}
                                className="input-3d w-full h-24 p-4 font-medium text-gray-800 dark:text-white resize-none text-sm bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={addToCart}
                        disabled={!currentFile}
                        className="w-full py-4 text-xl shadow-xl hover:-translate-y-1"
                    >
                        {t('add_items') || 'Add items'} (+ ₹{currentFile ? calculateItemCost(currentSettings) : 0})
                    </Button>
                </motion.div>

                {/* Right Side: 3D List Summary */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col h-full"
                >
                    <div className="card-3d p-8 flex-1 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <ShoppingCart size={200} />
                        </div>

                        <h2 className="text-2xl font-black mb-6 text-gray-800 dark:text-white flex items-center gap-3 relative z-10 text-3d">
                            <ShoppingCart size={28} className="text-green-600" />
                            {t('your_list') || 'Order List'}
                        </h2>

                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
                                <AlertCircle size={20} />
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto min-h-[300px] space-y-4 mb-6 pr-2 relative z-10 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                    <ShoppingCart size={80} className="mb-4" />
                                    <p className="font-bold text-lg">{t('no_orders') || 'Your list is empty'}</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="card-3d p-4 flex justify-between items-center group hover:bg-white dark:hover:bg-gray-700 transition"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 card-3d rounded-xl text-blue-600">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-white text-sm max-w-[150px] truncate">{item.file.name}</p>
                                                    <p className="text-xs text-gray-500 font-semibold capitalize">
                                                        {item.printType} ({item.sides}) • {item.pages} pgs • {item.copies} copies
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-black text-gray-800 dark:text-white text-lg">₹{item.cost}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-700 relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 font-bold uppercase tracking-wider">{t('total_estimate') || 'Total'}</span>
                                <span className="text-4xl font-black text-gray-800 dark:text-white text-3d">₹{calculateGrandTotal()}</span>
                            </div>

                            <div className="card-3d bg-blue-50 dark:bg-blue-900/10 p-5 mb-6 border border-blue-100 dark:border-blue-800">
                                <div className="flex justify-between items-center text-blue-800 dark:text-blue-300">
                                    <span className="font-bold text-sm uppercase">{t('advance_pay_label') || 'Advance to Pay (50%)'}</span>
                                    <span className="font-black text-2xl">₹{Math.ceil(calculateGrandTotal() / 2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmitOrder}
                                disabled={cart.length === 0}
                                isLoading={loading}
                                className="w-full py-4 text-xl shadow-xl hover:-translate-y-1"
                            >
                                {t('submit_pay') || 'Submit & Pay'}
                            </Button>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Promotional / Professional Services Section */}
            <div className="max-w-6xl mx-auto mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"></div>
                    <h3 className="text-2xl font-black text-gray-400 uppercase tracking-[0.2em] text-center">{t('premium_services') || 'Premium Services'}</h3>
                    <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    {/* Feature 1 - COMING SOON PLACEHOLDER */}
                    <div className="card-3d p-8 text-center group hover:-translate-y-2 transition-transform duration-300 border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <div className="w-20 h-20 mx-auto card-3d rounded-full flex items-center justify-center mb-6 text-gray-400 bg-gray-100 dark:bg-gray-800">
                            <FileText size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-gray-500 dark:text-gray-400">{t('word_docs') || 'Word Documents'}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium">
                            {t('word_coming_soon') || 'Upload, Edit & Converter features are'}
                            <span className="block mt-2 font-bold text-blue-500 uppercase tracking-wider">{t('launching_soon') || 'Coming Soon'}</span>
                        </p>
                    </div>

                    {/* Feature 2: The Editor */}
                    <div className="card-3d p-8 text-center group hover:-translate-y-2 transition-transform duration-300 border-2 border-blue-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            {t('new_feature') || 'New Feature'}
                        </div>
                        <div className="w-20 h-20 mx-auto card-3d rounded-full flex items-center justify-center mb-6 text-blue-600 bg-blue-50 dark:bg-blue-900/10 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Scissors size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{t('live_pdf_editor') || 'Live PDF Editor'}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('live_editor_desc') || 'No need for external tools. Remove unwanted pages, rotate orientation, and finalize your doc right here in our tab.'}
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="card-3d p-8 text-center group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-20 h-20 mx-auto card-3d rounded-full flex items-center justify-center mb-6 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Monitor size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{t('digital_deliver') || 'Digital Delivery'}</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('digital_desc') || 'Get digital copies alongside your physical prints. We store your important docs securely for easy re-ordering.'}
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-4xl font-black text-gray-300 dark:text-gray-700 italic tracking-tight">{t('quality_quote') || '"Where Quality Meets Speed"'}</p>
                </div>
            </div>
        </div>
    );
};

export default Order;
