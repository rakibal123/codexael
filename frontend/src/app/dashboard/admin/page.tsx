"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Loader2, LayoutDashboard, ShoppingCart, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalMessages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };

                // Fetch orders and messages concurrently
                const [ordersRes, messagesRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/orders", config),
                    axios.get("http://localhost:5000/api/messages", config)
                ]);

                const orders = ordersRes.data;
                const messages = messagesRes.data;

                const pending = orders.filter((o: any) => o.status === "Pending").length;
                const completed = orders.filter((o: any) => o.status === "Completed").length;

                setStats({
                    totalOrders: orders.length,
                    pendingOrders: pending,
                    completedOrders: completed,
                    totalMessages: messages.length,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: <ShoppingCart className="w-6 h-6 text-blue-400" />,
            bgLight: "bg-blue-500/10",
        },
        {
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: <Clock className="w-6 h-6 text-yellow-400" />,
            bgLight: "bg-yellow-500/10",
        },
        {
            title: "Completed Orders",
            value: stats.completedOrders,
            icon: <CheckCircle className="w-6 h-6 text-green-400" />,
            bgLight: "bg-green-500/10",
        },
        {
            title: "Total Messages",
            value: stats.totalMessages,
            icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
            bgLight: "bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-primary-500 shrink-0" />
                    Admin Overview
                </h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Executive summary of platform activity and metrics.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((card, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        key={idx}
                        className="glass-card p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bgLight}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-white mb-1 group-hover:scale-105 transform origin-left transition-transform duration-300">
                                {card.value}
                            </h3>
                            <p className="text-sm font-medium text-gray-400">{card.title}</p>
                        </div>

                        {/* Decorative glow */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${card.bgLight} blur-3xl rounded-full opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity`} />
                    </motion.div>
                ))}
            </div>

            <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/5 mt-6 sm:mt-12 bg-white/[0.02]">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
                    <button onClick={() => window.location.href = '/dashboard/admin/projects'} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm sm:text-base text-left">
                        Manage Projects
                    </button>
                    <button onClick={() => window.location.href = '/dashboard/admin/users'} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm sm:text-base text-left">
                        Manage Users
                    </button>
                    <button onClick={() => window.location.href = '/dashboard/admin/messages'} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors text-sm sm:text-base text-left">
                        Read Inquiries
                    </button>
                </div>
            </div>
        </div>
    );
}
