"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Loader2, Users, Trash2, ShieldCheck, Mail, User, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminUsersPage() {
    const { user } = useAuthStore();
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.get("http://localhost:5000/api/users", config);
            setUsersList(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) fetchUsers();
    }, [user]);

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
            toast.success("User deleted");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    };

    const RoleBadge = ({ role }: { role: string }) =>
        role === "admin" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20">
                <ShieldCheck className="w-3 h-3" /> Admin
            </span>
        ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10">
                <User className="w-3 h-3" /> User
            </span>
        );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary-500 shrink-0" />
                    Manage Users
                </h1>
                <p className="text-gray-400 mt-1.5 text-sm sm:text-base">View and manage registered accounts.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : usersList.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No users found</h3>
                    <p className="text-gray-400 max-w-sm">No registered users on the platform yet.</p>
                </div>
            ) : (
                <>
                    {/* ── Desktop Table ─────────────────────────── */}
                    <div className="hidden md:block glass-card rounded-2xl border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/8 bg-white/[0.03]">
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {usersList.map((u: any) => (
                                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs border border-primary-500/20 shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-semibold text-white text-sm">{u.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-gray-400 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 shrink-0" /> {u.email}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <RoleBadge role={u.role} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                disabled={u._id === user?._id || u.role === "admin"}
                                                className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-white/5 hover:border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={u.role === "admin" ? "Cannot delete admin" : "Delete User"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Card Layout ────────────────────── */}
                    <div className="md:hidden space-y-3">
                        {usersList.map((u: any, idx: number) => (
                            <motion.div
                                key={u._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.04 }}
                                className="glass-card rounded-2xl border border-white/5 p-4"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm border border-primary-500/20 shrink-0">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-white truncate text-sm">{u.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                        </div>
                                    </div>
                                    <RoleBadge role={u.role} />
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        Joined {new Date(u.createdAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={() => handleDeleteUser(u._id)}
                                        disabled={u._id === user?._id || u.role === "admin"}
                                        className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-white/5 hover:border-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title={u.role === "admin" ? "Cannot delete admin" : "Delete User"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
