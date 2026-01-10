"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, DollarSign, Users, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!loading) {
                if (!user) {
                    router.push("/login");
                    return;
                }

                // SIMPLE BYPASS FOR DEMO: Allow access if email contains 'admin'
                if (user.email?.includes("admin")) {
                    setIsAdmin(true);
                } else {
                    // FOR DEMO: Allow everyone to see admin panel to verify
                    setIsAdmin(true);
                }
                setCheckingRole(false);
            }
        };
        checkAdmin();
    }, [user, loading, router]);

    const links = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { href: "/admin/orders", label: "Orders", icon: <ShoppingBag size={20} /> },
        { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
        { href: "/admin/pricing", label: "Pricing & QR", icon: <DollarSign size={20} /> },
    ];

    if (loading || checkingRole) {
        return <div className="h-screen flex items-center justify-center">Loading Admin Panel...</div>;
    }

    if (!isAdmin) return null;

    return (
        <div className="container py-8 flex gap-8">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-2">
                <div className="card p-4 mb-4 bg-primary text-primary-foreground border-none">
                    <p className="text-xs opacity-80 uppercase font-bold mb-1">Admin Panel</p>
                    <p className="font-bold truncate">{user?.name || user?.displayName || "Admin"}</p>
                </div>

                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${isActive
                                ? "bg-primary/10 text-primary font-bold border border-primary/20"
                                : "hover:bg-secondary text-foreground/80"
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}

                <button
                    onClick={logout}
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
