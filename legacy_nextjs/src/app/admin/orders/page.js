"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Search, Filter, MessageCircle, Eye, CheckCircle, XCircle } from "lucide-react";

export default function AdminOrdersPage() {
    const [filter, setFilter] = useState("all");

    // Mock Data
    const orders = [
        { id: "ORD-1001", user: "Prajwal", phone: "9876543210", amount: 150, status: "Pending", date: "Today, 10:30 AM" },
        { id: "ORD-1002", user: "Rahul", phone: "9876543211", amount: 45, status: "Printing", date: "Today, 11:15 AM" },
        { id: "ORD-1003", user: "Sneha", phone: "9876543212", amount: 200, status: "Ready", date: "Today, 09:00 AM" },
        { id: "ORD-1004", user: "Amit", phone: "9876543213", amount: 80, status: "Completed", date: "Yesterday" },
    ];

    const handleStatusChange = (id, newStatus) => {
        // API Call to update status
        console.log(`Update ${id} to ${newStatus}`);
        alert(`Status updated to ${newStatus}`);
    };

    const sendWhatsApp = (order) => {
        const message = `Hello ${order.user}, your order ${order.id} is ${order.status}. Total: ₹${order.amount}.`;
        const url = `https://wa.me/91${order.phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Orders</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Filter size={16} className="mr-2" /> Filter</Button>
                    <Button variant="outline" size="sm"><Search size={16} className="mr-2" /> Search</Button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="p-4 font-medium opacity-70">Order ID</th>
                                <th className="p-4 font-medium opacity-70">User Details</th>
                                <th className="p-4 font-medium opacity-70">Cost</th>
                                <th className="p-4 font-medium opacity-70">Date</th>
                                <th className="p-4 font-medium opacity-70">Status</th>
                                <th className="p-4 font-medium opacity-70 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="p-4 font-medium">{order.id}</td>
                                    <td className="p-4">
                                        <p className="font-bold">{order.user}</p>
                                        <p className="text-xs opacity-60">{order.phone}</p>
                                    </td>
                                    <td className="p-4 font-bold">₹{order.amount}</td>
                                    <td className="p-4 opacity-70">{order.date}</td>
                                    <td className="p-4">
                                        <select
                                            className="bg-secondary p-1 rounded text-xs border border-border"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option>Pending</option>
                                            <option>Printing</option>
                                            <option>Ready</option>
                                            <option>Completed</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button
                                            onClick={() => sendWhatsApp(order)}
                                            className="p-2 hover:bg-green-100 text-green-600 rounded-full"
                                            title="Send WhatsApp"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-full" title="View Details">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-green-100 text-green-600 rounded-full" title="Mark Complete">
                                            <CheckCircle size={18} />
                                        </button>
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
