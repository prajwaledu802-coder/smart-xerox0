"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    return (
        <div className="container py-12 animate-fade-in">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold">Get in Touch</h1>
                <p className="text-xl opacity-70 max-w-2xl mx-auto">
                    Have questions or need support? We're here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="card space-y-6">
                        <h3 className="text-2xl font-bold">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Phone</p>
                                    <p className="font-medium">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Email</p>
                                    <p className="font-medium">support@smartxerox.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Address</p>
                                    <p className="font-medium">
                                        123, College Road,<br />
                                        Opp. University Gate,<br />
                                        Bangalore, Karnataka - 560001
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card space-y-4 bg-secondary/50">
                        <h3 className="text-xl font-bold">Operating Hours</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Mon - Fri</span>
                                <span className="font-medium">8:00 AM - 8:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saturday</span>
                                <span className="font-medium">9:00 AM - 6:00 PM</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sunday</span>
                                <span className="font-medium text-destructive">Closed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="card p-8">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center text-3xl">
                                ✓
                            </div>
                            <h3 className="text-2xl font-bold">Message Sent!</h3>
                            <p className="opacity-70">
                                Thanks for reaching out. We'll get back to you shortly.
                            </p>
                            <Button variant="outline" onClick={() => setSuccess(false)}>
                                Send Another Message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold">Send us a Message</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="First Name" id="firstName" required />
                                <Input label="Last Name" id="lastName" required />
                            </div>

                            <Input label="Email" id="contactEmail" type="email" required />

                            <div className="space-y-1">
                                <label className="text-sm opacity-70 ml-1">Message</label>
                                <textarea
                                    className="w-full p-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px]"
                                    required
                                ></textarea>
                            </div>

                            <Button className="w-full" size="lg" isLoading={loading}>
                                Send Message
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
