export default function OrdersPage() {
    // Mock Data (Full List)
    const orders = [
        { id: "#ORD-8832", date: "17 Dec 2024", type: "Xerox (B&W)", pages: 15, status: "Printing", amount: 45 },
        { id: "#ORD-7721", date: "16 Dec 2024", type: "Printout (Color)", pages: 50, status: "Ready", amount: 120 },
        { id: "#ORD-6610", date: "12 Dec 2024", type: "Xerox (B&W)", pages: 5, status: "Completed", amount: 15 },
        { id: "#ORD-5501", date: "10 Dec 2024", type: "Spiral Binding", pages: 120, status: "Completed", amount: 250 },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <p className="opacity-70">Track and manage your print history.</p>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="p-4 font-medium opacity-70">Order ID</th>
                                <th className="p-4 font-medium opacity-70">Date</th>
                                <th className="p-4 font-medium opacity-70">Type</th>
                                <th className="p-4 font-medium opacity-70">Pages</th>
                                <th className="p-4 font-medium opacity-70">Status</th>
                                <th className="p-4 font-medium opacity-70">Amount</th>
                                <th className="p-4 font-medium opacity-70">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="p-4 font-medium">{order.id}</td>
                                    <td className="p-4">{order.date}</td>
                                    <td className="p-4">{order.type}</td>
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
                                    <td className="p-4 flex gap-2">
                                        <button className="text-primary hover:underline">Invoice</button>
                                        {order.status === 'Completed' && (
                                            <button className="text-primary hover:underline opacity-70">Reorder</button>
                                        )}
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
