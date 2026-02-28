"use client";

import { useState } from "react";
import { Loader2, Mail, MapPin, Send, Phone } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post(`${API_URL}/api/messages`, {
                name,
                email,
                subject,
                message
            });

            toast.success("Message sent successfully!");

            // Clear form
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pt-32 pb-20 min-h-screen relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 relative z-10">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 pt-8"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">Let's <span className="text-primary-400">Talk</span></h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-lg">
                            Ready to start your next project? Drop us a direct line and let's craft something beautiful together.
                        </p>

                        <div className="space-y-8 glass-card p-8 rounded-3xl border border-white/5 inline-block w-full max-w-lg bg-surface-light">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Email Us</h3>
                                    <a href="mailto:codexael@gmail.com" className="text-gray-400 hover:text-primary-400 hover:underline transition-all">codexael@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Call Us</h3>
                                    <a href="tel:01531386247" className="text-gray-400 hover:text-primary-400 hover:underline transition-all">0 1531 386247</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-400 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                                    <p className="text-gray-400">North Kafrul, Dhaka-1216</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className="glass-card p-10 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative">
                            {/* Glow effect on top of form */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>

                            <h2 className="text-2xl font-bold text-white mb-8">Send a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
                                        placeholder="Project Inquiry"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600 resize-none"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group mt-4! cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-3 group-hover:block hidden animate-in slide-in-from-left-2 duration-300" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </div>
            <Footer />
        </>
    );
}
