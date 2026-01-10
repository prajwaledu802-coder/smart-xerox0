"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, FileText, CreditCard, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const links = [
        { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
        { href: "/dashboard/new-order", label: "New Order", icon: <PlusCircle size={20} /> },
        { href: "/dashboard/orders", label: "My Orders", icon: <FileText size={20} /> },
        { href: "/dashboard/payments", label: "Payments", icon: <CreditCard size={20} /> },
        { href: "/dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            // Router redirection handled by AuthContext or protected route logic is better
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="container py-8 flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-2">
                <div className="card p-4 mb-4 bg-primary/5 border-primary/20">
                    <p className="text-xs opacity-60 uppercase font-bold mb-1">Welcome back</p>
                    <p className="font-bold truncate">{user?.displayName || "Student"}</p>
                </div>

                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${isActive
                                    ? "bg-primary text-primary-foreground font-medium shadow-md"
                                    : "hover:bg-secondary text-foreground/80"
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-destructive/10 text-destructive text-left mt-auto transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 animate-fade-in">
                {children}
            </div>
        </div>
    );
}
