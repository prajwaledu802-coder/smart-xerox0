"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            await signup(formData.email, formData.password, formData.name);
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email is already registered. Please login.");
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card space-y-6 p-8">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-sm opacity-70">Join Smart Xerox today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md animate-slide-in">
                        {error}
                    </div>
                )}

                <Input
                    id="name"
                    type="text"
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                />

                <Button className="w-full" size="lg" isLoading={loading}>
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="opacity-70">Already have an account? </span>
                <Link href="/login" className="text-primary font-medium hover:underline">
                    Log in
                </Link>
            </div>
        </div>
    );
}
