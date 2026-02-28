"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Loader2, MessageSquare, Mail, Calendar, User, AlignLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMessagesPage() {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };
                const res = await axios.get("http://localhost:5000/api/messages", config);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchMessages();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-primary-500" />
                    Messages & Inquiries
                </h1>
                <p className="text-gray-400 mt-2">Read messages submitted through the contact form.</p>
            </div>

            {messages.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No messages</h3>
                    <p className="text-gray-400 max-w-sm">No one has contacted you through the form yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.map((msg: any) => (
                        <motion.div
                            key={msg._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-white text-lg line-clamp-1">{msg.subject}</h3>
                                        <p className="text-sm font-medium text-primary-400 flex items-center gap-1.5 mt-1">
                                            <User className="w-3.5 h-3.5" />
                                            {msg.name}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400 line-clamp-3 mb-6">
                                    {msg.message}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <a
                                    href={`mailto:${msg.email}`}
                                    className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => setSelectedMessage(msg)}
                                    className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-lg"
                                >
                                    Read Full
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Message Details Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl max-h-[90vh] overflow-y-auto glass-card border border-white/10 rounded-3xl p-8 z-50 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>

                            <div className="flex flex-col gap-2 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="font-semibold text-white">{selectedMessage.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <a href={`mailto:${selectedMessage.email}`} className="text-primary-400 hover:underline">
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" /> Message Content
                                </h3>
                                <div className="text-gray-300 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 whitespace-pre-wrap text-sm">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
