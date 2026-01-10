"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setLoading(true);

        try {
            await resetPassword(email);
            setMessage({ type: "success", text: "Password reset link sent! Check your email." });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to send reset link. Please check the email." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card space-y-6 p-8">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-sm opacity-70">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {message.text && (
                    <div className={`p-3 text-sm rounded-md animate-slide-in ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                        {message.text}
                    </div>
                )}

                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button className="w-full" size="lg" isLoading={loading}>
                    Send Reset Link
                </Button>
            </form>

            <div className="text-center text-sm">
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
