"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user } = useAuthStore();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Projects", href: "/projects" },
        { name: "Skills", href: "/skills" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="absolute top-0 w-full z-50 bg-transparent py-6">
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative z-50">
                <Link
                    href={isAuthenticated ? (user?.role === "admin" ? "/dashboard/admin" : "/dashboard") : "/"}
                    className="text-2xl font-bold tracking-tighter cursor-pointer"
                >
                    Code<span className="text-primary-400">xael</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-foreground hover:text-primary-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <Link
                            href={user?.role === "admin" ? "/dashboard/admin/orders" : "/dashboard"}
                            className="px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-md shadow-primary-500/20"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/login"
                                className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-foreground font-medium transition-all border border-white/10"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-md shadow-primary-500/20"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        className="text-foreground cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-md z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-0 w-full bg-background/95 border-b border-white/10 shadow-2xl overflow-hidden z-50"
                    >
                        <div className="flex flex-col px-6 py-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-foreground hover:text-primary-400"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10">
                                {isAuthenticated ? (
                                    <Link
                                        href={user?.role === "admin" ? "/dashboard/admin/orders" : "/dashboard"}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-center w-full px-6 py-3 rounded-xl bg-primary-600 text-white font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-center w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground font-medium hover:bg-white/10"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-center w-full px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
