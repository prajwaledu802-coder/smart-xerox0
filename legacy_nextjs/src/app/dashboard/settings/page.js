"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SettingsPage() {
    const { user } = useAuth(); // AuthContext should also expose a refreshUser method theoretically, but reload works

    const [profile, setProfile] = useState({
        name: user?.name || "", // Changed from displayName to name to match DB
        email: user?.email || ""
    });
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: profile.name })
            });

            if (!res.ok) throw new Error('Failed to update profile');

            setMessage({ type: "success", text: "Profile updated successfully! Refresh to see changes." });
            // In a real app we'd update client context immediately

        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: passwords.new })
            });

            if (!res.ok) throw new Error('Failed to update password');

            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to update password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="opacity-70">Manage your account preferences and security.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    {message.text}
                </div>
            )}

            {/* Profile Section */}
            <div className="card space-y-6">
                <h2 className="text-xl font-bold border-b border-border pb-2">Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <Input
                        label="Full Name"
                        id="fullName"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <Input
                        label="Email Address"
                        id="settingsEmail"
                        type="email"
                        value={profile.email}
                        disabled
                        className="opacity-60 cursor-not-allowed"
                    />
                    <Button isLoading={loading}>Update Profile</Button>
                </form>
            </div>

            {/* Security Section */}
            <div className="card space-y-6">
                <h2 className="text-xl font-bold border-b border-border pb-2">Security</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Input
                        label="New Password"
                        id="newPassword"
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        minLength={6}
                    />
                    <Input
                        label="Confirm New Password"
                        id="confirmNewPassword"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                    <Button variant="outline" isLoading={loading}>Change Password</Button>
                </form>
            </div>
        </div>
    );
}
