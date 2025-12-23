"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();

    // Mock Data
    const stats = [
        { label: "Total Orders", value: "12", icon: <FileText size={20} />, color: "bg-blue-500" },
        { label: "Pending", value: "2", icon: <Clock size={20} />, color: "bg-orange-500" },
        { label: "Completed", value: "10", icon: <CheckCircle size={20} />, color: "bg-green-500" },
        { label: "Total Savings", value: "₹150", icon: <TrendingUp size={20} />, color: "bg-purple-500" },
    ];

    const recentOrders = [
        { id: "#ORD-8832", date: "Today", pages: 15, status: "Printing", amount: 45 },
        { id: "#ORD-7721", date: "Yesterday", pages: 50, status: "Ready", amount: 120 },
        { id: "#ORD-6610", date: "12 Dec", pages: 5, status: "Completed", amount: 15 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="opacity-70">Welcome back, {user?.displayName || "Student"} 👋</p>
                </div>
                <Link href="/dashboard/new-order">
                    <Button>New Order</Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="card p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${stat.color} shadow-lg`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs opacity-60 uppercase font-bold">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="card p-0 overflow-hidden animate-slide-in">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="font-bold text-lg">Recent Orders</h2>
                    <Link href="/dashboard/orders" className="text-primary text-sm hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="p-4 font-medium opacity-70">Order ID</th>
                                <th className="p-4 font-medium opacity-70">Date</th>
                                <th className="p-4 font-medium opacity-70">Pages</th>
                                <th className="p-4 font-medium opacity-70">Status</th>
                                <th className="p-4 font-medium opacity-70">Amount</th>
                                <th className="p-4 font-medium opacity-70">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="p-4 font-medium">{order.id}</td>
                                    <td className="p-4">{order.date}</td>
                                    <td className="p-4">{order.pages}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-orange-100 text-orange-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold">₹{order.amount}</td>
                                    <td className="p-4">
                                        <button className="text-primary hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
