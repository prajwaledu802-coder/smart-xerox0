
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import useStore from '../store/useStore';
import api from '../utils/api';
import { Upload, FileText, X, Info, Printer, Copy, File, Plus, Trash2, ShoppingCart, AlertCircle, Edit, Sparkles, Scissors, Monitor, Eye, FileOutput, MessageCircle, CheckCircle, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import PdfEditor from '../components/PdfEditor';
import WordEditor from '../components/WordEditor';
import Slider from '../components/ui/Slider';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import BottomNav from '../components/BottomNav'; // Added Import

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
                    toast.info(`Detected ${realPageCount} pages(PDF).`);
                } else if (selected.name.endsWith('.docx') || selected.name.endsWith('.doc')) {
                    // Advanced Heuristic: Word Count
                    try {
                        const arrayBuffer = await selected.arrayBuffer();
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        const text = result.value || "";
                        const wordCount = text.split(/\s+/).length;

                        // Roughly 500 words per page (Standard Academic Page)
                        realPageCount = Math.max(1, Math.ceil(wordCount / 500));
                        toast.info(`Estimated ~${realPageCount} pages(${wordCount} words).`);
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

    // --- Mobile Scroll Logic ---
    const orderListRef = useRef(null);
    const addItemRef = useRef(null);
    const [activeMobileTab, setActiveMobileTab] = useState('add'); // 'add' or 'list'

    const scrollToPanel = (panel) => {
        setActiveMobileTab(panel);
        if (panel === 'list' && orderListRef.current) {
            orderListRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        } else if (panel === 'add' && addItemRef.current) {
            addItemRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
    };

    // Auto-scroll to list when item added
    useEffect(() => {
        if (cart.length > 0 && activeMobileTab === 'add' && window.innerWidth < 768) {
            const timer = setTimeout(() => {
                scrollToPanel('list');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [cart.length]);

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 pb-24 md:pb-10 transition-colors duration-300">
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

            {/* --- MOBILE TOP TABS --- */}
            <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 flex justify-center p-2 gap-4 transition-all duration-300">
                <button
                    onClick={() => scrollToPanel('add')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeMobileTab === 'add'
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    <div className={`w-2 h-2 rounded-full ${activeMobileTab === 'add' ? 'bg-white' : 'bg-gray-400'}`} />
                    {t('add_item') || 'Add Item'}
                </button>
                <button
                    onClick={() => scrollToPanel('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeMobileTab === 'list'
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/20'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    <div className={`w-2 h-2 rounded-full ${activeMobileTab === 'list' ? 'bg-white' : 'bg-gray-400'}`} />
                    {t('order_list') || 'Order List'}
                    {cart.length > 0 && <span className="bg-white text-purple-600 px-1.5 py-0.5 rounded-full text-[10px] min-w-[16px] text-center">{cart.length}</span>}
                </button>
            </div>

            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white mb-2 md:mb-4 text-center hidden md:block" // Hidden on mobile to save space
                >
                    {t('create_order') || 'Create New Order'}
                </motion.h1>

                {/* --- MAIN SWIPE LAYOUT (Mobile: Flex Row, Desktop: Grid) --- */}
                <div className="flex md:grid md:grid-cols-12 gap-0 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide pb-8 -mx-4 md:mx-0">

                    {/* --- PANEL 1: ADD ITEM --- */}
                    <div ref={addItemRef} className="min-w-full md:min-w-0 md:col-span-7 snap-center px-4 md:px-0 pt-16 md:pt-0"> {/* Added pt-16 for mobile tabs */}
                        <div className="card-3d p-6 md:p-8 space-y-6 md:space-y-8 bg-white dark:bg-[#1a1c23]">
                            <h2 className="text-2xl md:text-3xl font-black mb-4 md:mb-8 text-gray-800 dark:text-white flex items-center gap-3 text-3d">
                                <Plus size={28} className="text-blue-600" />
                                {t('add_items') || 'Add Items'}
                            </h2>

                            {/* Module Selection Tabs */}
                            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
                                <button
                                    onClick={() => setActiveModule('pdf')}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeModule === 'pdf' ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <FileText size={18} /> {t('pdf_module') || 'PDF'}
                                </button>
                                <button
                                    onClick={() => setActiveModule('word')}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeModule === 'word' ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <MessageCircle size={18} /> {t('doc_module') || 'Word'}
                                </button>
                            </div>

                            {/* File Upload Hero */}
                            <div className="mb-6">
                                {activeModule === 'pdf' ? (
                                    <>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf"
                                        />
                                        {!currentFile ? (
                                            <label htmlFor="file-upload" className="block w-full h-48 md:h-64 border-3 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-800/50 group hover:shadow-inner relative overflow-hidden">
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="w-16 h-16 md:w-24 md:h-24 card-3d rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-red-500 bg-red-50 dark:bg-red-900/20">
                                                        <Upload size={32} />
                                                    </div>
                                                    <span className="font-black text-gray-800 dark:text-gray-100 text-lg md:text-2xl">{t('upload_pdf_title') || 'Upload PDF'}</span>
                                                    <p className="text-gray-400 mt-2 font-medium text-xs md:text-sm">{t('browse_files') || 'Tap to browse'}</p>
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
                                                    <button onClick={() => setPreviewFile(currentFile)} className="w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                                        <Eye size={18} /> {t('preview') || 'Preview'}
                                                    </button>
                                                    <button onClick={() => setEditorFile(currentFile)} className="w-full py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                                                        <Edit size={18} /> {t('edit_pages') || 'Edit'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Word Module
                                    <div className="card-3d h-[300px] p-8 flex flex-col items-center justify-center text-center bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800">
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                            <MessageCircle size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{t('manual_format') || 'Manual Formatting'}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 font-medium">Use WhatsApp for Word Docs.</p>
                                        <a href={`https://wa.me/919916220476?text=${encodeURIComponent(`Hi, need help with Word doc.`)}`} target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#25D366] text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2">
                                            <MessageCircle size={20} /> WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Print Type */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('print_type') || 'Print Type'}</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {['bw', 'color'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setCurrentSettings(s => ({ ...s, printType: type }))}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-between ${currentSettings.printType === type
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-blue-300'
                                                    }`}
                                            >
                                                {type === 'bw' ? 'B&W' : 'Color'}
                                                {currentSettings.printType === type && <CheckCircle size={16} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side Options */}
                                <div className="space-y-4">
                                    {/* Copies Slider */}
                                    <div>
                                        <Slider
                                            label={t('copies') || 'Copies'}
                                            min={1}
                                            max={50}
                                            value={currentSettings.copies}
                                            onChange={(val) => setCurrentSettings(s => ({ ...s, copies: val }))}
                                            className="mb-4"
                                        />
                                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                                            <button onClick={() => setCurrentSettings(s => ({ ...s, copies: Math.max(1, s.copies - 1) }))} className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><Minus size={16} /></button>
                                            <span className="flex-1 text-center font-bold text-lg">{currentSettings.copies}</span>
                                            <button onClick={() => setCurrentSettings(s => ({ ...s, copies: s.copies + 1 }))} className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><Plus size={16} /></button>
                                        </div>
                                    </div>

                                    {/* Double Sided Toggle */}
                                    <button
                                        onClick={() => setCurrentSettings(s => ({ ...s, sides: s.sides === 'single' ? 'double' : 'single' }))}
                                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-between border-2 transition-all font-bold text-sm ${currentSettings.sides === 'double'
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-500'
                                            }`}
                                    >
                                        <span>Double Sided</span>
                                        {currentSettings.sides === 'double' ? <CheckCircle size={16} /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                                    </button>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block uppercase tracking-wider">Instructions</label>
                                <textarea
                                    placeholder="Spiral binding, edge print..."
                                    value={currentSettings.instructions || ''}
                                    onChange={(e) => setCurrentSettings(s => ({ ...s, instructions: e.target.value }))}
                                    className="input-3d w-full h-20 p-3 font-medium text-gray-800 dark:text-white resize-none text-sm bg-gray-50 dark:bg-gray-800"
                                />
                            </div>

                            {/* Add Button (Sticky Bottom of Panel 1 on Mobile) */}
                            <Button
                                onClick={addToCart}
                                disabled={!currentFile}
                                className={`w-full py-4 text-lg shadow-xl shadow-blue-500/20 ${!currentFile ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                            >
                                <Plus size={24} strokeWidth={3} className="mr-2" />
                                {t('add_to_order') || 'Add to List'}
                            </Button>
                        </div>
                    </div>

                    {/* --- PANEL 2: ORDER LIST --- */}
                    <div ref={orderListRef} className="min-w-full md:min-w-0 md:col-span-5 snap-center px-4 md:px-0 pt-16 md:pt-0 flex flex-col h-full">
                        <div className="card-3d p-6 md:p-8 bg-white dark:bg-[#1a1c23] flex-1 flex flex-col h-full md:min-h-[500px]">
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                <ShoppingCart className="text-purple-600" />
                                {t('your_cart') || 'Your Order'}
                                <span className="bg-gray-100 dark:bg-gray-800 text-sm px-3 py-1 rounded-full text-gray-500">{cart.length}</span>
                            </h2>

                            {error && (
                                <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
                                    <AlertCircle size={20} />
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto space-y-4 max-h-[50vh] md:max-h-[400px] custom-scrollbar scroll-smooth pr-2">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-8">
                                        <FileText size={48} className="mb-4 opacity-50" />
                                        <p className="font-bold">List is empty</p>
                                        <p className="text-xs mt-2">Add items from the left panel</p>
                                        <Button variant="ghost" onClick={() => scrollToPanel('add')} className="mt-4 md:hidden text-blue-500">
                                            Go to Add Item
                                        </Button>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {cart.map((item) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                key={item.id}
                                                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl relative group border border-transparent hover:border-purple-500/30 transition-all"
                                            >
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 z-10"
                                                >
                                                    <Trash2 size={12} />
                                                </button>

                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                                                            <FileText size={20} className="text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px]">{item.file.name}</h4>
                                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                                {item.printType === 'bw' ? 'B&W' : 'Color'} • {item.copies} copies • {item.sides === 'double' ? 'Double' : 'Single'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">₹{item.cost}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Sticky Footer for Total & Pay */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Estimate</span>
                                    <div className="text-right">
                                        <span className="text-4xl font-black text-gray-800 dark:text-white block leading-none">
                                            ₹<AnimatedCounter value={calculateGrandTotal()} />
                                        </span>
                                        <span className="text-xs text-green-500 font-bold">Free Delivery applied</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmitOrder}
                                    disabled={cart.length === 0 || loading}
                                    className={`w-full py-4 text-xl shadow-2xl shadow-purple-500/30 bg-gradient-to-r from-purple-600 to-pink-600 ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
                                >
                                    {loading ? 'Processing...' : (t('submit_order') || 'Pay & Order')}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Promotional / Professional Services Section */}
            < div className="max-w-6xl mx-auto mb-20" >
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
            </div >
        </div >
    );
};

export default Order;
