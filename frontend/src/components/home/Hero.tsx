"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";

export default function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-6 flex justify-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-medium">
                            <Code2 className="w-4 h-4" />
                            Available for exciting projects
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white relative"
                    >
                        Full Stack Agency
                        <span className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-blue-500 blur opacity-20 -z-10 rounded-2xl"></span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed"
                    >
                        We build modern, scalable, and beautifully designed web applications. Plunging into deep code to deliver premium digital experiences.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                    >
                        <Link
                            href="/projects"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white font-medium transition-all flex items-center justify-center group"
                        >
                            View Projects
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-light border border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-medium transition-all flex items-center justify-center"
                        >
                            Hire Us
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
