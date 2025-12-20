import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ServicesPage() {
    return (
        <div className="container py-12 space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Our Services</h1>
                <p className="text-xl opacity-70 max-w-2xl mx-auto">
                    High-quality printing and xerox services tailored for students.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="card space-y-4 hover:border-primary transition-colors">
                    <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-4xl mb-4">
                        📄
                    </div>
                    <h3 className="text-2xl font-bold">Black & White Xerox</h3>
                    <p className="opacity-70">
                        Perfect for notes, assignments, and study material. Crisp and clear text reproduction.
                    </p>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li>• high-speed laser printing</li>
                        <li>• 75 GSM paper quality</li>
                        <li>• Double-sided options available</li>
                    </ul>
                    <div className="pt-4">
                        <span className="text-lg font-bold text-primary">Starts at ₹2/page</span>
                    </div>
                </div>

                <div className="card space-y-4 hover:border-primary transition-colors">
                    <div className="h-48 bg-blue-50 rounded-md flex items-center justify-center text-4xl mb-4">
                        🌈
                    </div>
                    <h3 className="text-2xl font-bold">Colour Printout</h3>
                    <p className="opacity-70">
                        Vibrant colors for project reports, presentations, and posters.
                    </p>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li>• High-quality inkjet/laser</li>
                        <li>• 80-100 GSM paper options</li>
                        <li>• Glossy paper available</li>
                    </ul>
                    <div className="pt-4">
                        <span className="text-lg font-bold text-primary">Starts at ₹5/page</span>
                    </div>
                </div>

                <div className="card space-y-4 hover:border-primary transition-colors">
                    <div className="h-48 bg-yellow-50 rounded-md flex items-center justify-center text-4xl mb-4">
                        📚
                    </div>
                    <h3 className="text-2xl font-bold">Spiral Binding</h3>
                    <p className="opacity-70">
                        Secure your documents with professional spiral or soft binding.
                    </p>
                    <ul className="space-y-2 text-sm opacity-80">
                        <li>• Durable plastic covers</li>
                        <li>• Multiple coil colors</li>
                        <li>• Quick turnaround</li>
                    </ul>
                    <div className="pt-4">
                        <span className="text-lg font-bold text-primary">Starts at ₹30/book</span>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <Link href="/dashboard/new-order">
                    <Button size="lg">Start Your Order</Button>
                </Link>
            </div>
        </div>
    );
}
