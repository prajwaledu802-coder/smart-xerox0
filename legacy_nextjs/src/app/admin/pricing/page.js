"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function PricingPage() {
    const [prices, setPrices] = useState({
        xeroxSingle: 2,
        xeroxDouble: 3,
        printBWSingle: 3,
        printBWDouble: 4,
        printColorSingle: 5,
        printColorDouble: 10
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        // API Call
        alert("Prices updated successfully!");
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <h1 className="text-3xl font-bold">Pricing & Payment Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pricing Control */}
                <div className="card space-y-6">
                    <h2 className="text-xl font-bold border-b border-border pb-2">Update Prices</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <h3 className="font-bold text-sm text-primary">Xerox (B&W)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Single Side (₹)"
                                id="xs"
                                type="number"
                                value={prices.xeroxSingle}
                                onChange={(e) => setPrices({ ...prices, xeroxSingle: e.target.value })}
                            />
                            <Input
                                label="Double Side (₹)"
                                id="xd"
                                type="number"
                                value={prices.xeroxDouble}
                                onChange={(e) => setPrices({ ...prices, xeroxDouble: e.target.value })}
                            />
                        </div>

                        <h3 className="font-bold text-sm text-primary">Printout (B&W)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Single Side (₹)" id="ps" type="number" value={prices.printBWSingle} onChange={(e) => setPrices({ ...prices, printBWSingle: e.target.value })} />
                            <Input label="Double Side (₹)" id="pd" type="number" value={prices.printBWDouble} onChange={(e) => setPrices({ ...prices, printBWDouble: e.target.value })} />
                        </div>

                        <h3 className="font-bold text-sm text-primary">Printout (Color)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Single Side (₹)" id="cs" type="number" value={prices.printColorSingle} onChange={(e) => setPrices({ ...prices, printColorSingle: e.target.value })} />
                            <Input label="Double Side (₹)" id="cd" type="number" value={prices.printColorDouble} onChange={(e) => setPrices({ ...prices, printColorDouble: e.target.value })} />
                        </div>

                        <Button className="w-full">Save New Prices</Button>
                    </form>
                </div>

                {/* QR Code Management */}
                <div className="card space-y-6 h-fit">
                    <h2 className="text-xl font-bold border-b border-border pb-2">Payment QR Code</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-border rounded flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-primary/50">
                            {/* Current QR Preview */}
                            <div className="text-gray-400 text-sm font-medium">Click to Upload</div>
                        </div>
                        <p className="text-sm opacity-70 text-center">
                            Upload a new QR code image to update the payment modal for all users.
                        </p>
                        <Button variant="outline">Upload New QR</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
