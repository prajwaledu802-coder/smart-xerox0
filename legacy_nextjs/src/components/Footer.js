import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground py-12 mt-12 border-t border-border">
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-primary mb-4">Smart Xerox</h3>
                    <p className="text-sm opacity-80">
                        Premium printing services for students. Fast, affordable, and high quality.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-primary">Home</Link></li>
                        <li><Link href="/services" className="hover:text-primary">Services</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                        <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4">Contact</h4>
                    <p className="text-sm opacity-80">
                        support@smartxerox.com<br />
                        +91 98765 43210
                    </p>
                </div>
            </div>
            <div className="container mt-8 pt-8 border-t border-border/20 text-center text-sm opacity-60">
                &copy; {new Date().getFullYear()} Smart Xerox. All rights reserved.
            </div>
        </footer>
    );
}
