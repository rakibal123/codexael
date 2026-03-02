"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { PlusCircle, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.token) return;
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, [user?.token]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Welcome back, <span className="text-primary-400">{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">Here is what's happening with your projects today.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <Link href="/dashboard/orders" className="glass-card p-6 rounded-2xl border border-white/5 hover:border-primary-500/40 transition-colors group cursor-pointer block">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm font-medium group-hover:text-primary-400 transition-colors">Total Orders</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-primary-400 group-hover:bg-primary-500/10 transition-colors">
                            <ShoppingBagIcon className="w-6 h-6" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/orders" className="glass-card p-6 rounded-2xl border border-white/5 hover:border-yellow-500/40 transition-colors group cursor-pointer block">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm font-medium group-hover:text-yellow-400 transition-colors">Active Projects</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.active}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-yellow-400 group-hover:bg-yellow-500/10 transition-colors">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/completed-work" className="glass-card p-6 rounded-2xl border border-white/5 hover:border-accent/40 transition-colors group cursor-pointer block">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-gray-400 text-sm font-medium group-hover:text-accent transition-colors">Completed</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{stats.completed}</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-accent group-hover:bg-accent/10 transition-colors">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </Link>
            </div>

            {user?.role === "client" && (
                <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-primary-900/20 to-transparent">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Start a new project</h2>
                    <p className="text-gray-400 mb-5 sm:mb-6 max-w-2xl text-sm sm:text-base">
                        Have a new idea in mind? Let's bring it to life. Fill out a simple brief to get started on your next premium digital experience.
                    </p>
                    <Link
                        href="/dashboard/new-order"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-lg shadow-primary-500/25"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Request
                    </Link>
                </div>
            )}
        </div>
    );
}

function ShoppingBagIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}
