"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Send } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 relative mb-12">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-3xl border border-blue-400/30 p-12 md:p-20 text-center"
                >
                    {/* Deep Blue Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-primary-800 to-blue-950 z-0"></div>

                    {/* Light Blue Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] z-0"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full blur-[80px] z-0"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-sm">Ready to start your project?</h2>
                        <p className="text-xl text-blue-100/90 mb-10 font-medium">
                            Let's transform your vision into a high-performance digital reality. Our inbox is always open for new opportunities.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-10 py-5 rounded-full bg-white text-background font-bold hover:bg-primary-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:-translate-y-1 cursor-pointer group"
                        >
                            <span className="text-lg">Get in Touch</span>
                            <Send className="w-5 h-5 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
