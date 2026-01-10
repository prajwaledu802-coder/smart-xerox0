import Link from "next/link";
import Button from "@/components/ui/Button";

export default function PricingPage() {
    return (
        <div className="container py-12 space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
                <p className="text-xl opacity-70 max-w-2xl mx-auto">
                    No hidden charges. Pay for what you print.
                </p>
            </div>

            <div className="card p-0 overflow-hidden max-w-4xl mx-auto">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary text-secondary-foreground">
                                <th className="p-4 border-b border-border">Service Type</th>
                                <th className="p-4 border-b border-border">Single Side</th>
                                <th className="p-4 border-b border-border">Double Side (Front & Back)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-secondary/20 transition-colors">
                                <td className="p-4 border-b border-border font-medium">Xerox (B&W)</td>
                                <td className="p-4 border-b border-border">₹2.00</td>
                                <td className="p-4 border-b border-border">₹3.00</td>
                            </tr>
                            <tr className="hover:bg-secondary/20 transition-colors">
                                <td className="p-4 border-b border-border font-medium">Printout (B&W)</td>
                                <td className="p-4 border-b border-border">₹3.00</td>
                                <td className="p-4 border-b border-border">₹4.00</td>
                            </tr>
                            <tr className="hover:bg-secondary/20 transition-colors">
                                <td className="p-4 border-b border-border font-medium">Colour Printout</td>
                                <td className="p-4 border-b border-border">₹5.00</td>
                                <td className="p-4 border-b border-border">₹10.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="card p-6 space-y-4">
                    <h3 className="text-xl font-bold">Bulk Discounts</h3>
                    <p className="opacity-70">
                        Ordering more than 100 pages? Get special rates automatically applied at checkout.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm opacity-80">
                        <li>100+ pages: 5% off</li>
                        <li>500+ pages: 10% off</li>
                    </ul>
                </div>
                <div className="card p-6 space-y-4">
                    <h3 className="text-xl font-bold">Binding Services</h3>
                    <p className="opacity-70">
                        Professional binding to keep your documents safe.
                    </p>
                    <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                        <span>Spiral Binding</span>
                        <span className="font-bold">₹30</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Soft Binding</span>
                        <span className="font-bold">₹50</span>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <Link href="/dashboard/new-order">
                    <Button size="lg">Calculate Your Price</Button>
                </Link>
            </div>
        </div>
    );
}
