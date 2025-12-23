"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X, User } from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300 animate-slide-in">
            <div className="container flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold flex items-center gap-2">
                    <span className="text-primary text-2xl">⚡</span>
                    Smart Xerox
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
                    <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <select className="bg-transparent border border-border rounded px-2 py-1 text-sm focus:outline-none">
                        <option value="en">English</option>
                        <option value="kn">Kannada</option>
                        <option value="hi">Hindi</option>
                    </select>

                    <Link href="/login">
                        <Button variant="outline" size="sm">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg animate-fade-in">
                    <Link href="/" className="py-2 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/services" className="py-2 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Services</Link>
                    <Link href="/pricing" className="py-2 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                    <Link href="/contact" className="py-2 border-b border-border/50" onClick={() => setIsMenuOpen(false)}>Contact</Link>

                    <div className="flex items-center justify-between py-2">
                        <span>Theme</span>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-secondary">
                            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Link href="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Link href="/signup" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full">Sign Up</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
