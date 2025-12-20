"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ identifier: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMobileLogin, setIsMobileLogin] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Note: For mobile login, you'd typically handle it differently or allow it as email
            // Here we assume identifier is email for Firebase Auth basic implementation
            // or map mobile to a specific email format if needed. 
            // For now, standard Email/Password login.
            await login(formData.identifier, formData.password);
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card space-y-6 p-8">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-sm opacity-70">Enter your credentials to access your account</p>
            </div>

            <div className="flex bg-secondary p-1 rounded-lg">
                <button
                    className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${!isMobileLogin ? 'bg-background shadow-sm' : 'opacity-60'}`}
                    onClick={() => setIsMobileLogin(false)}
                >
                    Email
                </button>
                <button
                    className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${isMobileLogin ? 'bg-background shadow-sm' : 'opacity-60'}`}
                    onClick={() => setIsMobileLogin(true)}
                >
                    Mobile
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md animate-slide-in">
                        {error}
                    </div>
                )}

                <Input
                    id="identifier"
                    type={isMobileLogin ? "tel" : "email"}
                    label={isMobileLogin ? "Mobile Number" : "Email Address"}
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    required
                />

                <div className="space-y-1">
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <div className="text-right">
                        <Link href="/forgot-password" class="text-xs text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button className="w-full" size="lg" isLoading={loading}>
                    Sign In
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="opacity-70">Don't have an account? </span>
                <Link href="/signup" className="text-primary font-medium hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
