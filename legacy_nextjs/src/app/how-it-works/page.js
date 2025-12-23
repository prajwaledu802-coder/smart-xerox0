import Link from "next/link";
import Button from "@/components/ui/Button";
import { Upload, Settings, Calculator, CreditCard, CheckCircle } from "lucide-react";

export default function HowItWorksPage() {
    const steps = [
        {
            icon: <Upload size={32} />,
            title: "Upload Document",
            description: "Upload your PDF, DOC, or Image files securely. We support all major formats."
        },
        {
            icon: <Settings size={32} />,
            title: "Customize Order",
            description: "Select Xerox or Print, Color or B&W, Single or Double Sided."
        },
        {
            icon: <Calculator size={32} />,
            title: "Get Instant Quote",
            description: "See the exact cost immediately. Our smart calculator shows your savings."
        },
        {
            icon: <CreditCard size={32} />,
            title: "Pay 50% Advance",
            description: "Pay just half the amount via UPI/QR to confirm your order."
        },
        {
            icon: <CheckCircle size={32} />,
            title: "Collect Order",
            description: "Pick up your high-quality prints from the store without waiting."
        }
    ];

    return (
        <div className="container py-12 space-y-16 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">How It Works</h1>
                <p className="text-xl opacity-70 max-w-2xl mx-auto">
                    Smart Xerox makes printing simple. Just 5 easy steps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
                {/* Connector Line (Desktop Only) */}
                <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-1 bg-border -z-10" />

                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center space-y-4 group">
                        <div className="w-24 h-24 bg-card border-2 border-primary/20 rounded-full flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                            {step.icon}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                            {index + 1}
                        </div>
                        <h3 className="text-lg font-bold">{step.title}</h3>
                        <p className="text-sm opacity-70">{step.description}</p>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto space-y-8 pt-12">
                <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <div className="card">
                        <h4 className="font-bold mb-2">Is my document secure?</h4>
                        <p className="text-sm opacity-70">Yes, all files are encrypted and automatically deleted after your order is completed.</p>
                    </div>
                    <div className="card">
                        <h4 className="font-bold mb-2">Can I cancel my order?</h4>
                        <p className="text-sm opacity-70">You can cancel before printing starts. The advance payment will be refunded to your wallet.</p>
                    </div>
                    <div className="card">
                        <h4 className="font-bold mb-2">What file formats are supported?</h4>
                        <p className="text-sm opacity-70">We support PDF, DOCX, JPG, and PNG files up to 50MB.</p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <Link href="/dashboard/new-order">
                    <Button size="lg">Ready to Print?</Button>
                </Link>
            </div>
        </div>
    );
}
