"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Loader2, CheckCircle, ExternalLink, Download, CreditCard, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CompletedWorkPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const res = await axios.get("http://localhost:5000/api/orders/myorders", config);
                setOrders(res.data.filter((order: any) => order.status === "Completed"));
            } catch (error) {
                console.error("Failed to fetch completed orders", error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.token) fetchOrders();
    }, [user]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    Completed Work
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
                </h1>
                <p className="text-gray-400 mt-1.5 text-sm sm:text-base">Access and download your finished projects.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : orders.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No completed projects yet</h3>
                    <p className="text-gray-400 max-w-sm mb-6 text-sm">
                        When your project is marked as finished by our team, deliverables and download links will appear here.
                    </p>
                    <Link
                        href="/dashboard/orders"
                        className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm"
                    >
                        View Active Orders
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orders.map((order: any, idx: number) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: idx * 0.06 }}
                            className="glass-card rounded-2xl border border-white/5 overflow-hidden group"
                        >
                            {/* Emerald accent bar */}
                            <div className="h-1 w-full bg-emerald-500/60" />

                            <div className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                                            {order.projectType}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            Completed {new Date(order.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-400 text-sm line-clamp-2">{order.description}</p>

                                {/* Action buttons */}
                                <div className="pt-3 border-t border-white/5 space-y-2">
                                    {order.deliverableLink ? (
                                        <a
                                            href={order.deliverableLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <Download className="w-4 h-4" />
                                            Access Deliverables
                                        </a>
                                    ) : (
                                        <div className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/5 text-gray-500 text-sm font-medium">
                                            Deliverable link pending...
                                        </div>
                                    )}

                                    {order.paymentLink && (
                                        <a
                                            href={order.paymentLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 text-primary-400 font-semibold text-sm transition-all"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Payment Link
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
