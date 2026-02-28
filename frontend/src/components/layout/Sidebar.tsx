"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
    Home,
    ShoppingBag,
    PlusCircle,
    Users,
    FolderPlus,
    Settings,
    LogOut,
    CreditCard,
    CheckSquare,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    isMobileOpen?: boolean;
    setIsMobileOpen?: any;
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const clientLinks = [
        { name: "Overview", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
        { name: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-5 h-5" /> },
        { name: "New Order", href: "/dashboard/new-order", icon: <PlusCircle className="w-5 h-5" /> },
        { name: "Payment", href: "/dashboard/payment", icon: <CreditCard className="w-5 h-5" /> },
        { name: "Completed Work", href: "/dashboard/completed-work", icon: <CheckSquare className="w-5 h-5" /> },
    ];

    const adminLinks = [
        { name: "Overview", href: "/dashboard/admin", icon: <Home className="w-5 h-5" /> },
        { name: "Manage Orders", href: "/dashboard/admin/orders", icon: <ShoppingBag className="w-5 h-5" /> },
        { name: "Manage Projects", href: "/dashboard/admin/projects", icon: <FolderPlus className="w-5 h-5" /> },
        { name: "Manage Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5" /> },
    ];

    const links = user?.role === "admin" ? adminLinks : clientLinks;

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen?.(false)}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-surface-light border-r border-white/5 h-[100dvh] flex flex-col transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <Link href={user?.role === "admin" ? "/dashboard/admin" : "/dashboard"} className="text-2xl font-bold tracking-tighter cursor-pointer">
                        Code<span className="text-primary-400">xael</span>
                    </Link>
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white rounded-xl bg-white/5"
                        onClick={() => setIsMobileOpen?.(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <p className="font-semibold text-white truncate">{user?.name || "Guest"}</p>
                        <p className="text-xs text-primary-400 uppercase mt-1 font-bold">{user?.role}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary-600/10 text-primary-400 border border-primary-500/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                                    }`}
                            >
                                {link.icon}
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
