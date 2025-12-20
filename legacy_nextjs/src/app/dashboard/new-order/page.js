"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Calculator, CheckCircle, Smartphone } from "lucide-react";

export default function NewOrderPage() {
    const router = useRouter();

    // State
    const [file, setFile] = useState(null);
    const [config, setConfig] = useState({
        type: "xerox", // xerox, printout
        color: "bw", // bw, color
        sides: "single", // single, double
        copies: 1,
        pages: 1, // Default dummy pages count (real app would parse PDF)
    });
    const [pricing, setPricing] = useState({
        total: 0,
        advance: 0,
        balance: 0,
        savings: 0
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState(1); // 1: QR, 2: Success

    // Pricing Logic (Mock Data based on Requirements)
    const RATES = {
        xerox: {
            bw: { single: 2, double: 3 }, // Front Page: 2, Front & Back: 3
        },
        printout: {
            bw: { single: 3, double: 4 },
            color: { single: 5, double: 10 }
        }
    };

    const MARKET_RATES = {
        averagePerSheet: 5 // Mock market rate for savings calc
    };

    useEffect(() => {
        calculatePrice();
    }, [config, file]);

    const calculatePrice = () => {
        if (!file) return;

        // Determine rate based on selection
        let ratePerSheet = 0;
        if (config.type === 'xerox') {
            // Xerox only has B&W in requirements, but safe to handle
            ratePerSheet = RATES.xerox.bw[config.sides];
        } else {
            ratePerSheet = RATES.printout[config.color][config.sides];
        }

        // Logic: 
        // If double sided, we assume 'pages' count means distinct PDF pages. 
        // 'Sheets' physical paper would be Math.ceil(pages / 2) for double sided.
        // However, requirements give price for "Front & Back". 
        // Usually "Front & Back: ₹3" means per physical sheet (2 pages).
        // Let's assume standard calculation: 
        // Price = (Pages / 2) * Rate_Double if Double Sided
        // Price = Pages * Rate_Single if Single Sided

        let totalSheets = config.pages;
        let cost = 0;

        if (config.sides === 'double') {
            totalSheets = Math.ceil(config.pages / 2);
            cost = totalSheets * ratePerSheet;
        } else {
            cost = config.pages * ratePerSheet; // Rate per page
        }

        // Multiply by copies
        cost = cost * config.copies;

        const advance = Math.ceil(cost * 0.5);
        const balance = cost - advance;

        // Mock Savings
        const marketCost = config.pages * config.copies * MARKET_RATES.averagePerSheet;
        const savings = Math.max(0, marketCost - cost);

        setPricing({
            total: cost,
            advance,
            balance,
            savings
        });
    };

    const handlePlaceOrder = () => {
        // Simulate API call
        setTimeout(() => {
            setPaymentStep(2);
            // Auto redirect after success
            setTimeout(() => {
                router.push("/dashboard/orders");
            }, 3000);
        }, 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">New Order</h1>
                    <p className="text-sm opacity-70">Upload your document and customize your print.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upload & Config */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold">1. Upload File</h2>
                        <FileUpload onFileSelect={(f) => setFile(f)} />
                        {/* Mock Page Count Input for Demo since we can't parse PDF in browser easily without heavy libs */}
                        {file && (
                            <div className="flex items-center gap-2 text-sm bg-yellow-50 p-2 rounded text-yellow-800 border border-yellow-200">
                                <span>⚠️ Detected Pages (Simulated):</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={config.pages}
                                    onChange={(e) => setConfig({ ...config, pages: parseInt(e.target.value) || 1 })}
                                    className="w-16 p-1 rounded border border-yellow-400"
                                />
                                <span className="text-xs opacity-70">(Edit this to text logic)</span>
                            </div>
                        )}
                    </section>

                    {file && (
                        <section className="space-y-4 animate-fade-in">
                            <h2 className="text-xl font-bold">2. Configuration</h2>

                            <div className="card space-y-6">
                                {/* Service Type */}
                                <div className="space-y-2">
                                    <label className="font-medium">Service Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            className={`p-3 rounded border text-center transition-all ${config.type === 'xerox' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border hover:bg-secondary'}`}
                                            onClick={() => setConfig({ ...config, type: 'xerox', color: 'bw' })} // Xerox is always BW
                                        >
                                            Xerox (Photocopy)
                                        </button>
                                        <button
                                            className={`p-3 rounded border text-center transition-all ${config.type === 'printout' ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border hover:bg-secondary'}`}
                                            onClick={() => setConfig({ ...config, type: 'printout' })}
                                        >
                                            Printout (Direct Print)
                                        </button>
                                    </div>
                                </div>

                                {/* Color and Sides */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-medium">Color</label>
                                        <select
                                            className="input"
                                            value={config.color}
                                            onChange={(e) => setConfig({ ...config, color: e.target.value })}
                                            disabled={config.type === 'xerox'} // Disable if Xerox
                                        >
                                            <option value="bw">Black & White</option>
                                            <option value="color">Colour</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-medium">Sides</label>
                                        <select
                                            className="input"
                                            value={config.sides}
                                            onChange={(e) => setConfig({ ...config, sides: e.target.value })}
                                        >
                                            <option value="single">Single Side</option>
                                            <option value="double">Double Side (Front & Back)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Copies */}
                                <div className="space-y-2">
                                    <label className="font-medium">Number of Copies</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="w-10 h-10 rounded border border-border hover:bg-secondary flex items-center justify-center font-bold"
                                            onClick={() => setConfig({ ...config, copies: Math.max(1, config.copies - 1) })}
                                        >-</button>
                                        <span className="flex-1 text-center font-bold text-xl">{config.copies}</span>
                                        <button
                                            className="w-10 h-10 rounded border border-border hover:bg-secondary flex items-center justify-center font-bold"
                                            onClick={() => setConfig({ ...config, copies: config.copies + 1 })}
                                        >+</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Pricing Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className={`card p-6 space-y-4 border-2 ${file ? 'border-primary/20' : 'border-dashed opacity-70'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Calculator size={20} className="text-primary" />
                                <h3 className="font-bold text-lg">Order Summary</h3>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="opacity-70">Total Pages</span>
                                    <span>{config.pages * config.copies}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-70">Type</span>
                                    <span className="capitalize">{config.color} {config.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-70">Sides</span>
                                    <span className="capitalize">{config.sides}</span>
                                </div>
                                <hr className="border-border/50 my-2" />
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total Cost</span>
                                    <span>₹{pricing.total}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-success">
                                    <span>You Save</span>
                                    <span>₹{pricing.savings}</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <div className="bg-secondary/50 p-3 rounded text-sm space-y-1">
                                    <div className="flex justify-between font-medium">
                                        <span>Advance to Pay (50%)</span>
                                        <span>₹{pricing.advance}</span>
                                    </div>
                                    <div className="flex justify-between opacity-70 text-xs">
                                        <span>Balance at Pickup</span>
                                        <span>₹{pricing.balance}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={!file}
                                    onClick={() => {
                                        setPaymentStep(1);
                                        setShowPaymentModal(true);
                                    }}
                                >
                                    Pay ₹{pricing.advance} & Place Order
                                </Button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-2 text-xs opacity-60 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <CheckCircle size={16} />
                                <span>Secure Payment</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Smartphone size={16} />
                                <span>Instant Updates</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                title="Confirm Payment"
            >
                {paymentStep === 1 ? (
                    <div className="space-y-6 text-center animate-fade-in">
                        <p className="opacity-70">Scan the QR code to pay the advance amount.</p>

                        <div className="mx-auto w-48 h-48 bg-gray-200 rounded flex items-center justify-center border-2 border-primary overflow-hidden relative">
                            {/* Placeholder for QR Code */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 text-9xl font-bold">QR</div>
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=smartxerox@upi&pn=SmartXerox&am=${pricing.advance}&cu=INR"
                                alt="Payment QR"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="text-2xl font-bold text-primary">₹{pricing.advance}</div>

                        <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded">
                            Use any UPI App (GPay, PhonePe, Paytm)
                        </div>

                        <Button className="w-full" onClick={handlePlaceOrder}>
                            I Have Paid
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 text-center animate-fade-in py-8">
                        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white text-4xl mx-auto shadow-lg animate-bounce">
                            ✓
                        </div>
                        <h3 className="text-2xl font-bold">Order Placed Successfully!</h3>
                        <p className="opacity-70">
                            Your order ID is <span className="font-mono font-bold">#ORD-{(Math.random() * 10000).toFixed(0)}</span>
                        </p>
                        <p className="text-sm">Redirecting to your orders...</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
