"use client";

import { useAuth } from "@/context/AuthContext";
import { TrendingUp, ShoppingBag, Users, AlertCircle } from "lucide-react";

export default function AdminDashboardPage() {
    const stats = [
        { label: "Daily Orders", value: "25", diff: "+12%", icon: <ShoppingBag size={20} />, color: "bg-blue-500" },
        { label: "Today's Revenue", value: "₹2,450", diff: "+8%", icon: <TrendingUp size={20} />, color: "bg-green-500" },
        { label: "New Users", value: "8", diff: "+2", icon: <Users size={20} />, color: "bg-purple-500" },
        { label: "Pending Issues", value: "3", diff: "-1", icon: <AlertCircle size={20} />, color: "bg-orange-500" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="bg-secondary px-4 py-2 rounded-md text-sm">
                    Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="card p-6 space-y-2">
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.diff.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {stat.diff}
                            </span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs opacity-60 uppercase font-bold">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="card p-0 overflow-hidden">
                    <div className="p-4 border-b border-border font-bold">Recent Orders</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-secondary/10">
                                    <td className="p-3 font-medium">#ORD-{1000 + i}</td>
                                    <td className="p-3">User {i}</td>
                                    <td className="p-3">₹{i * 50}</td>
                                    <td className="p-3">
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* System Status / Quick Actions */}
                <div className="space-y-8">
                    <div className="card p-6">
                        <h3 className="font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 border border-border rounded hover:border-primary hover:text-primary transition-colors text-center">
                                Update Pricing
                            </button>
                            <button className="p-4 border border-border rounded hover:border-primary hover:text-primary transition-colors text-center">
                                Change QR Code
                            </button>
                            <button className="p-4 border border-border rounded hover:border-primary hover:text-primary transition-colors text-center">
                                View Reports
                            </button>
                            <button className="p-4 border border-border rounded hover:border-primary hover:text-primary transition-colors text-center">
                                Manage Users
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
