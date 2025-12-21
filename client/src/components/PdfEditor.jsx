import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Trash2, Check, Save, Loader, AlertCircle, ArrowLeft, ArrowRight, Scissors, Eye, GripVertical } from 'lucide-react';
import Button from './ui/Button';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Configure PDF.js worker locally
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// --- Sub-Component: Individual PDF Page (Render Logic) ---
const PdfPage = ({ pdfDoc, pageNum, scale, rotation, isDeleted, onRotate, onDelete, onRestore, readOnly, isOverlayVisible }) => {
    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null);

    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;

        const renderPage = async () => {
            try {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale });
                const canvas = canvasRef.current;

                if (!canvas) return;

                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Cancel previous render if any
                if (renderTaskRef.current) {
                    renderTaskRef.current.cancel();
                }

                renderTaskRef.current = page.render({
                    canvasContext: context,
                    viewport: viewport
                });

                await renderTaskRef.current.promise;
            } catch (err) {
                if (err.name !== 'RenderingCancelledException') {
                    console.error(`Error rendering page ${pageNum}:`, err);
                }
            }
        };

        renderPage();

        return () => {
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
            }
        };
    }, [pdfDoc, pageNum, scale]);

    return (
        <div className={`relative group bg-white transition-all duration-300 ${readOnly
            ? 'w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.4)]'
            : `card-3d p-2 flex flex-col items-center rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 ${isDeleted ? 'opacity-40 grayscale scale-95' : 'hover:scale-[1.02] hover:shadow-2xl'}`
            }`}>

            {/* Page Number Badge */}
            {!readOnly && (
                <span className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10 font-mono">
                    #{pageNum}
                </span>
            )}

            {/* Action Overlay */}
            {!readOnly && (
                <div className={`absolute inset-0 bg-white/95 dark:bg-gray-900/95 transition-opacity flex flex-col items-center justify-center gap-4 rounded-2xl z-20 backdrop-blur-sm p-6 ${isOverlayVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
                    {!isDeleted && (
                        <>
                            {/* Drag Handle hint */}
                            <div className="absolute top-4 right-4 text-gray-400">
                                <GripVertical size={20} />
                            </div>

                            <div className="flex gap-4 w-full justify-center">
                                <button
                                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                                    onClick={(e) => { e.stopPropagation(); onRotate(); }}
                                    className="flex-1 py-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white shadow-lg transition-all flex flex-col items-center gap-1 font-bold text-xs"
                                    title="Rotate"
                                >
                                    <RotateCw size={24} />
                                    Rotate
                                </button>
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                    className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white shadow-lg transition-all flex flex-col items-center gap-1 font-bold text-xs"
                                    title="Delete"
                                >
                                    <Trash2 size={24} />
                                    Delete
                                </button>
                            </div>

                            <div className="mt-2 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                Drag to Reorder
                            </div>
                        </>
                    )}

                    {isDeleted && (
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); onRestore(); }}
                            className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-500 shadow-xl flex items-center justify-center gap-2 font-bold text-lg"
                        >
                            <Check size={24} /> Restore Page
                        </button>
                    )}
                </div>
            )}

            {/* Canvas Container */}
            <div
                className={readOnly ? "w-full min-h-[500px] bg-white flex items-center justify-center overflow-hidden" : "w-full aspect-[1/1.4] bg-white rounded-lg shadow-inner overflow-hidden flex items-center justify-center relative border border-gray-100"}
                style={{ transform: `rotate(${rotation || 0}deg)`, transition: 'transform 0.3s ease' }}
            >
                <canvas ref={canvasRef} className="w-full h-auto object-contain" />
            </div>

            {isDeleted && !readOnly && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="bg-red-500/90 text-white px-3 py-1 rounded-md text-xs font-black shadow-xl border border-white/20 transform -rotate-12 uppercase tracking-wider">
                        Marked for Deletion
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Component: Sortable Wrapper ---
const SortablePdfPage = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.pageNum });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.3 : 1, // Dim when dragging
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <PdfPage {...props} isOverlayVisible={false} />
        </div>
    );
};

// --- Main Component ---
const PdfEditor = ({ file, isOpen, onClose, onSave, readOnly = false }) => {
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    // State
    const [pdfDoc, setPdfDoc] = useState(null); // The PDFJS Document Object
    const [pdfInfo, setPdfInfo] = useState({ pageCount: 0, pages: [] }); // pages: ordered array of original page numbers
    const [edits, setEdits] = useState({
        deleted: new Set(),
        rotations: {}
    });

    const [activeId, setActiveId] = useState(null);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement to start drag (prevents accidental drags on click)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (isOpen && file) {
            startLoading();
        } else {
            // Reset logic
            setPdfDoc(null);
            setPdfInfo({ pageCount: 0, pages: [] });
            setEdits({ deleted: new Set(), rotations: {} });
        }
    }, [isOpen, file]);

    const startLoading = async () => {
        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            const pdf = await loadingTask.promise;

            setPdfDoc(pdf);
            const pages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
            setPdfInfo({ pageCount: pdf.numPages, pages });

        } catch (err) {
            console.error("Error loading PDF:", err);
            if (err.name === 'MissingPDFException') {
                alert("Could not read PDF. File may be corrupted.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPdfInfo((items) => {
                const oldIndex = items.pages.indexOf(active.id);
                const newIndex = items.pages.indexOf(over.id);
                return {
                    ...items,
                    pages: arrayMove(items.pages, oldIndex, newIndex),
                };
            });
        }
        setActiveId(null);
    };

    // --- Actions ---
    const toggleDelete = (originalPageNum) => {
        if (readOnly) return;
        setEdits(prev => {
            const newDeleted = new Set(prev.deleted);
            if (newDeleted.has(originalPageNum)) {
                newDeleted.delete(originalPageNum);
            } else {
                newDeleted.add(originalPageNum);
            }
            return { ...prev, deleted: newDeleted };
        });
    };

    const rotatePage = (originalPageNum) => {
        if (readOnly) return;
        setEdits(prev => {
            const currentRotation = prev.rotations[originalPageNum] || 0;
            const newRotation = (currentRotation + 90) % 360;
            return {
                ...prev,
                rotations: { ...prev.rotations, [originalPageNum]: newRotation }
            };
        });
    };

    const handleSave = async () => {
        if (readOnly) return;
        setProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const originalPdfDoc = await PDFDocument.load(arrayBuffer);
            const newPdfDoc = await PDFDocument.create();

            for (const originalPageNum of pdfInfo.pages) {
                if (edits.deleted.has(originalPageNum)) continue;

                const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [originalPageNum - 1]);
                const rotation = edits.rotations[originalPageNum] || 0;
                const existingRotation = copiedPage.getRotation().angle;
                copiedPage.setRotation(degrees(existingRotation + rotation));

                newPdfDoc.addPage(copiedPage);
            }
            if (newPdfDoc.getPageCount() === 0) {
                alert("Cannot save an empty PDF!");
                setProcessing(false);
                return;
            }

            const pdfBytes = await newPdfDoc.save();
            const newBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const newFile = new File([newBlob], file.name, { type: 'application/pdf' });

            onSave(newFile);
            onClose();

        } catch (err) {
            console.error("Failed to save PDF:", err);
            alert("Failed to save changes.");
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 transition-all duration-300">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 w-full h-full sm:max-w-7xl sm:h-auto sm:max-h-[95vh] rounded-none sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative"
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm z-20">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                            {readOnly ? (
                                <><Eye className="text-green-600" /> Document Preview</>
                            ) : (
                                <><Scissors className="text-blue-600" /> Smart Editor</>
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium hidden sm:block">
                            {file?.name} • {readOnly ? `${pdfInfo.pageCount} Pages` : 'Drag to Reorder, Rotate, or Delete'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 relative custom-scrollbar ${readOnly ? 'flex flex-col items-center gap-8' : ''}`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 z-10">
                            <Loader size={48} className="animate-spin mb-4 text-blue-600" />
                            <p className="font-bold animate-pulse text-lg">Rendering...</p>
                        </div>
                    ) : (
                        <>
                            {readOnly ? (
                                // PREVIEW MODE (No Drag)
                                <div className="w-full max-w-3xl flex flex-col gap-8 pb-20 z-10 transition-all">
                                    {pdfInfo.pages.map((pageNum) => (
                                        <PdfPage
                                            key={`view-${pageNum}`}
                                            pdfDoc={pdfDoc}
                                            pageNum={pageNum}
                                            scale={1.5}
                                            readOnly={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                // EDIT MODE (Drag & Drop Grid)
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext items={pdfInfo.pages} strategy={rectSortingStrategy}>
                                        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6 pb-20 z-10 p-2 sm:p-4">
                                            {pdfInfo.pages.map((pageNum) => (
                                                <SortablePdfPage
                                                    key={pageNum}
                                                    pageNum={pageNum}
                                                    pdfDoc={pdfDoc}
                                                    scale={0.3}
                                                    rotation={edits.rotations[pageNum]}
                                                    isDeleted={edits.deleted.has(pageNum)}
                                                    onRotate={() => rotatePage(pageNum)}
                                                    onDelete={() => toggleDelete(pageNum)}
                                                    onRestore={() => toggleDelete(pageNum)}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>

                                    {/* Drag Overlay (The item being dragged) */}
                                    <DragOverlay>
                                        {activeId ? (
                                            <div className="opacity-90 scale-105 cursor-grabbing card-3d p-4 bg-white rounded-2xl ring-4 ring-blue-500 shadow-2xl">
                                                <PdfPage
                                                    pdfDoc={pdfDoc}
                                                    pageNum={activeId}
                                                    scale={0.3}
                                                    rotation={edits.rotations[activeId]}
                                                    isDeleted={edits.deleted.has(activeId)}
                                                    readOnly={true} // Hide buttons while dragging
                                                    isOverlayVisible={false}
                                                />
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center z-10 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            {pdfInfo.pages.length - edits.deleted.size} Pages {readOnly ? 'detected' : 'to Print'}
                        </div>
                        {!readOnly && edits.deleted.size > 0 && (
                            <div className="flex items-center gap-2 text-red-500">
                                <Trash2 size={14} />
                                {edits.deleted.size} Removed
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onClose} className="hidden sm:block px-6 py-3 font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">
                            {readOnly ? 'Close' : 'Cancel'}
                        </button>
                        {!readOnly && (
                            <Button onClick={handleSave} isLoading={processing} disabled={loading} className="px-6 sm:px-8 py-3 shadow-xl hover:-translate-y-1 flex items-center gap-2">
                                <Save size={18} /> <span className="hidden sm:inline">Save & Update</span><span className="sm:hidden">Save</span>
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PdfEditor;
