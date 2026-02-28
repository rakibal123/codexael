"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Sidebar from "@/components/layout/Sidebar";
import { Loader2, Menu, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (mounted && !isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [mounted, isAuthenticated, isLoading, router]);

    // Redirect admin away from /dashboard (client overview)
    useEffect(() => {
        if (!mounted || isLoading || !isAuthenticated) return;
        if (user?.role === "admin" && pathname === "/dashboard") {
            router.push("/dashboard/admin");
        }
    }, [mounted, isLoading, isAuthenticated, user, pathname, router]);

    // Block non-admins from admin routes
    useEffect(() => {
        if (!mounted || isLoading || !isAuthenticated) return;
        if (pathname.includes("/admin") && user?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [mounted, isLoading, isAuthenticated, user, pathname, router]);

    // Block admins from client-only routes
    useEffect(() => {
        if (!mounted || isLoading || !isAuthenticated) return;
        const clientOnlyPaths = ["/dashboard/orders", "/dashboard/new-order", "/dashboard/payment", "/dashboard/completed-work"];
        if (user?.role === "admin" && clientOnlyPaths.some(p => pathname.startsWith(p))) {
            router.push("/dashboard/admin");
        }
    }, [mounted, isLoading, isAuthenticated, user, pathname, router]);

    if (!mounted || isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface-light sticky top-0 z-30">
                    <Link
                        href={user?.role === "admin" ? "/dashboard/admin" : "/dashboard"}
                        className="text-xl font-bold tracking-tighter cursor-pointer"
                    >
                        Code<span className="text-primary-400">xael</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-white/5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
