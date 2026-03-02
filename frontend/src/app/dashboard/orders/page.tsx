"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import {
    Loader2, FileText, Clock, CheckCircle, XCircle, ExternalLink,
    Calendar, CreditCard, Download, Link as LinkIcon, ChevronRight, X, Zap, Eye, Settings2, Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyOrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        projectType: "",
        techPreference: "",
        budget: "",
        deadline: ""
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        paymentType: "bKash",
        transactionId: ""
    });
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);

    // Admin management state
    const [isAdminManaging, setIsAdminManaging] = useState(false);
    const [manageForm, setManageForm] = useState({
        status: "",
        paymentLink: "",
        deliverableLink: "",
        liveLink: "",
        githubLink: "",
        previewImage: ""
    });
    const [managePreviewFile, setManagePreviewFile] = useState<File | null>(null);
    const [isSavingManage, setIsSavingManage] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const res = await axios.get(`${API_URL}/api/orders/myorders`, config);
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.token) fetchOrders();
    }, [user]);

    const statusConfig: Record<string, { badge: string; icon: React.ReactNode; bar: string }> = {
        "Pending": {
            badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
            icon: <Clock className="w-3.5 h-3.5" />,
            bar: "bg-amber-500/60",
        },
        "In Progress": {
            badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
            icon: <Zap className="w-3.5 h-3.5" />,
            bar: "bg-blue-500/60",
        },
        "Completed": {
            badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
            icon: <CheckCircle className="w-3.5 h-3.5" />,
            bar: "bg-emerald-500/60",
        },
        "Cancelled": {
            badge: "bg-red-500/15 text-red-400 border-red-500/25",
            icon: <XCircle className="w-3.5 h-3.5" />,
            bar: "bg-red-500/60",
        },
    };

    const getStatusBadge = (status: string) => {
        const cfg = statusConfig[status] || { badge: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: null };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                {cfg.icon} {status}
            </span>
        );
    };

    const handleEditClick = () => {
        setEditForm({
            title: selectedOrder.title || "",
            description: selectedOrder.description || "",
            projectType: selectedOrder.projectType || "",
            techPreference: selectedOrder.techPreference || "",
            budget: selectedOrder.budget || "",
            deadline: selectedOrder.deadline ? new Date(selectedOrder.deadline).toISOString().split('T')[0] : ""
        });
        setIsEditing(true);
    };

    const handleUpdateOrder = async () => {
        if (!editForm.description || !editForm.projectType || !editForm.budget) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.put(`${API_URL}/api/orders/${selectedOrder._id}`, editForm, config);

            // Update local state
            setOrders((prev: any) => prev.map((o: any) => o._id === selectedOrder._id ? res.data : o));
            setSelectedOrder(res.data);
            setIsEditing(false);
            toast.success("Order updated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update order");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!paymentForm.transactionId && !paymentProofFile) {
            toast.error("Please provide a transaction ID or proof screenshot");
            return;
        }

        setIsPaying(true);
        try {
            const formData = new FormData();
            formData.append("paymentType", paymentForm.paymentType);
            if (paymentForm.transactionId) formData.append("transactionId", paymentForm.transactionId);
            if (paymentProofFile) formData.append("paymentProof", paymentProofFile);

            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const res = await axios.post(`${API_URL}/api/orders/${selectedOrder._id}/pay`, formData, config);

            setOrders((prev: any) => prev.map((o: any) => o._id === selectedOrder._id ? res.data : o));
            setSelectedOrder(res.data);
            toast.success("Payment proof submitted!");
            setPaymentProofFile(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Payment submission failed");
        } finally {
            setIsPaying(false);
        }
    };

    const handleOpenManage = () => {
        setManageForm({
            status: selectedOrder.status,
            paymentLink: selectedOrder.paymentLink || "",
            deliverableLink: selectedOrder.deliverableLink || "",
            liveLink: selectedOrder.liveLink || "",
            githubLink: selectedOrder.githubLink || "",
            previewImage: selectedOrder.previewImage || ""
        });
        setIsAdminManaging(true);
    };

    const handleSaveManage = async () => {
        setIsSavingManage(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            let finalPreviewImage = manageForm.previewImage;

            if (managePreviewFile) {
                const fd = new FormData();
                fd.append('previewImage', managePreviewFile);
                const uploadRes = await axios.post(
                    `${API_URL}/api/orders/${selectedOrder._id}/preview`,
                    fd,
                    { headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data' } }
                );
                finalPreviewImage = uploadRes.data.previewImage;
            }

            const res = await axios.put(`${API_URL}/api/orders/${selectedOrder._id}`, {
                ...manageForm,
                previewImage: finalPreviewImage
            }, config);

            setOrders((prev: any) => prev.map((o: any) => o._id === selectedOrder._id ? res.data : o));
            setSelectedOrder(res.data);
            setIsAdminManaging(false);
            setManagePreviewFile(null);
            toast.success("Order updated by Admin");
        } catch (error) {
            toast.error("Management update failed");
        } finally {
            setIsSavingManage(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">My Orders</h1>
                    <p className="text-gray-400 mt-1.5 text-sm sm:text-base">Track your project requests and access deliverables.</p>
                </div>
                <Link
                    href="/dashboard/new-order"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-600/90 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-500/20"
                >
                    <FileText className="w-4 h-4" />
                    New Order
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : orders.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No orders found</h3>
                    <p className="text-gray-400 max-w-sm mb-6">You haven't placed any project requests yet.</p>
                    <Link
                        href="/dashboard/new-order"
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all"
                    >
                        Place New Order
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order: any, idx: number) => {
                        const cfg = statusConfig[order.status];
                        const hasDeliverable = !!order.deliverableLink;
                        const hasPaymentLink = !!order.paymentLink;
                        const hasLiveLink = !!order.liveLink;
                        const hasPreview = !!order.previewImage;
                        const hasGithub = !!order.githubLink;

                        const previewUrl = order.liveLink || (order.previewImage?.startsWith("http") ? order.previewImage : `${API_URL}${order.previewImage}`);
                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.04 }}
                                onClick={() => setSelectedOrder(order)}
                                className="glass-card rounded-2xl border border-white/5 overflow-hidden cursor-pointer hover:border-white/10 transition-all group"
                            >
                                {/* Status accent bar */}
                                <div className={`h-1 w-full ${cfg?.bar || "bg-gray-500/40"}`} />

                                <div className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                <h3 className="font-bold text-white text-base group-hover:text-primary-400 transition-colors">
                                                    {order.projectType}
                                                </h3>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-1">{order.description}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-colors shrink-0 mt-1" />
                                    </div>

                                    {/* Info row */}
                                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CreditCard className="w-3 h-3" />
                                            {order.budget}
                                        </span>
                                    </div>

                                    {/* Simplified click action */}
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all group/btn"
                                        >
                                            Click here to know more
                                            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover/btn:text-primary-400 group-hover/btn:translate-x-0.5 transition-all" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Order Detail Bottom Sheet */}
            <AnimatePresence>
                {selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 60 }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="fixed bottom-0 sm:top-1/2 sm:bottom-auto left-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-2xl z-50"
                        >
                            <div className="bg-[#0f1623] border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                                {/* Drag pill */}
                                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5 sm:hidden" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap mb-1">
                                            <h2 className="text-xl font-bold text-white">
                                                {isEditing ? `Edit Order` : isAdminManaging ? "Manage Order (Admin)" : selectedOrder.projectType}
                                            </h2>
                                            {!isEditing && !isAdminManaging && getStatusBadge(selectedOrder.status)}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {isEditing ? "Modify your project requirements" : isAdminManaging ? "Update status and deliverables" : `Ordered on ${new Date(selectedOrder.createdAt).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedOrder(null); setIsEditing(false); setIsAdminManaging(false); }}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Project Type</label>
                                                <select
                                                    value={editForm.projectType}
                                                    onChange={(e) => setEditForm({ ...editForm, projectType: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                                >
                                                    <option value="Web Application">Web Application</option>
                                                    <option value="Mobile Application">Mobile Application</option>
                                                    <option value="Landing Page">Landing Page</option>
                                                    <option value="Backend API">Backend API Architecture</option>
                                                    <option value="UI/UX Design">UI/UX Design</option>
                                                    <option value="Consulting">Consulting / DevOps</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Project Title</label>
                                                <input
                                                    type="text"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                                    placeholder="Project Title"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Requirements Description</label>
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all resize-none"
                                                placeholder="Detailed requirements..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Budget Range</label>
                                                <input
                                                    type="text"
                                                    value={editForm.budget}
                                                    onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                                    placeholder="e.g. $500 - $1000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Target Deadline</label>
                                                <input
                                                    type="date"
                                                    value={editForm.deadline}
                                                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateOrder}
                                                disabled={isUpdating}
                                                className="flex-1 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : isAdminManaging ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                                                <select
                                                    value={manageForm.status}
                                                    onChange={(e) => setManageForm({ ...manageForm, status: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 outline-none"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Payment Link</label>
                                                <input
                                                    type="url"
                                                    value={manageForm.paymentLink}
                                                    onChange={(e) => setManageForm({ ...manageForm, paymentLink: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-primary-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deliverable Link</label>
                                                <input
                                                    type="url"
                                                    value={manageForm.deliverableLink}
                                                    onChange={(e) => setManageForm({ ...manageForm, deliverableLink: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-emerald-500 outline-none"
                                                    placeholder="Drive/Dropbox link"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Live Demo</label>
                                                <input
                                                    type="url"
                                                    value={manageForm.liveLink}
                                                    onChange={(e) => setManageForm({ ...manageForm, liveLink: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500 outline-none"
                                                    placeholder="Vercel/Netlify link"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">GitHub Link</label>
                                            <input
                                                type="url"
                                                value={manageForm.githubLink}
                                                onChange={(e) => setManageForm({ ...manageForm, githubLink: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-gray-400 outline-none"
                                                placeholder="GitHub repo URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preview Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setManagePreviewFile(e.target.files?.[0] || null)}
                                                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-600/20 file:text-primary-400"
                                            />
                                        </div>
                                        <div className="pt-4 flex gap-3">
                                            <button
                                                onClick={() => setIsAdminManaging(false)}
                                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveManage}
                                                disabled={isSavingManage}
                                                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isSavingManage ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                                Save Admin Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-in fade-in duration-300">
                                        {/* Description */}
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 text-sm">
                                                {selectedOrder.description}
                                            </p>
                                        </div>

                                        {/* Details grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-1.5 text-gray-400 mb-1.5 text-xs font-bold uppercase tracking-wider">
                                                    <Calendar className="w-3.5 h-3.5" /> Deadline
                                                </div>
                                                <p className="font-semibold text-white text-sm">
                                                    {new Date(selectedOrder.deadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-1.5 text-gray-400 mb-1.5 text-xs font-bold uppercase tracking-wider">
                                                    <CreditCard className="w-3.5 h-3.5" /> Payment
                                                </div>
                                                <p className="font-semibold text-white text-sm">{selectedOrder.paymentMethod}</p>
                                            </div>
                                        </div>

                                        {/* Edit Button for User (only if Pending) */}
                                        {selectedOrder.status === "Pending" && (
                                            <button
                                                onClick={handleEditClick}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-primary-600/20 border border-white/10 hover:border-primary-500/50 text-white text-sm font-bold transition-all"
                                            >
                                                Edit Order Requirements
                                            </button>
                                        )}

                                        {/* ── Admin-provided links ── */}
                                        {(selectedOrder.paymentLink || selectedOrder.deliverableLink || selectedOrder.liveLink || selectedOrder.githubLink || selectedOrder.previewImage) && (
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">From the Team</p>

                                                {selectedOrder.previewImage && (
                                                    <a href={selectedOrder.previewImage.startsWith("http") ? selectedOrder.previewImage : `${API_URL}${selectedOrder.previewImage}`} target="_blank" rel="noopener noreferrer"
                                                        className="block rounded-xl overflow-hidden border border-white/10 hover:border-primary-500/40 transition-colors group">
                                                        <img src={selectedOrder.previewImage.startsWith("http") ? selectedOrder.previewImage : `${API_URL}${selectedOrder.previewImage}`} alt="Project Preview"
                                                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                        <div className="px-3 py-2 flex items-center gap-1.5 text-xs text-gray-400 bg-white/[0.03]">
                                                            <ExternalLink className="w-3 h-3" /> Project Preview — click to open full size
                                                        </div>
                                                    </a>
                                                )}

                                                {/* Live Demo */}
                                                {selectedOrder.liveLink && (
                                                    <div className="flex items-center justify-between gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                                                        <div className="flex items-center gap-2">
                                                            <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                                                            <div>
                                                                <p className="text-xs font-bold text-blue-400">Live Demo</p>
                                                                <p className="text-[11px] text-gray-500">See your project live</p>
                                                            </div>
                                                        </div>
                                                        <a href={selectedOrder.liveLink} target="_blank" rel="noopener noreferrer"
                                                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
                                                            Open <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                )}

                                                {/* GitHub Code */}
                                                {selectedOrder.githubLink && (
                                                    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-200">GitHub Source Code</p>
                                                                <p className="text-[11px] text-gray-500">View the full codebase</p>
                                                            </div>
                                                        </div>
                                                        <a href={selectedOrder.githubLink} target="_blank" rel="noopener noreferrer"
                                                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all">
                                                            View Code <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Payment Link */}
                                                {selectedOrder.paymentLink && (
                                                    <div className="flex items-center justify-between gap-3 bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <div>
                                                                <p className="text-xs font-bold text-primary-400">Payment Link</p>
                                                                <p className="text-[11px] text-gray-500">Click to complete your payment</p>
                                                            </div>
                                                        </div>
                                                        <a href={selectedOrder.paymentLink} target="_blank" rel="noopener noreferrer"
                                                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all">
                                                            Pay Now <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Deliverable Link */}
                                                {selectedOrder.deliverableLink && (
                                                    <div className="flex items-center justify-between gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                                                        <div className="flex items-center gap-2">
                                                            <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                                                            <div>
                                                                <p className="text-xs font-bold text-emerald-400">Live Output</p>
                                                                <p className="text-[11px] text-gray-500">Your completed project is ready</p>
                                                            </div>
                                                        </div>
                                                        <a href={selectedOrder.deliverableLink} target="_blank" rel="noopener noreferrer"
                                                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all">
                                                            Open Result <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* Payment Submission Section (If not paid) */}
                                {!selectedOrder.transactionId && !selectedOrder.paymentProof && (
                                    <div className="rounded-2xl border border-primary-500/20 bg-primary-500/5 p-5 space-y-4">
                                        <div className="flex items-center gap-2 text-primary-400">
                                            <CreditCard className="w-4 h-4" />
                                            <p className="text-xs font-bold uppercase tracking-wider">Submit Payment Proof</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Method</label>
                                                <select
                                                    value={paymentForm.paymentType}
                                                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentType: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                                >
                                                    <option value="bKash" className="bg-[#0f1623]">bKash</option>
                                                    <option value="Bank Transfer" className="bg-[#0f1623]">Bank Transfer</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Transaction ID</label>
                                                <input
                                                    type="text"
                                                    value={paymentForm.transactionId}
                                                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                                    placeholder="TrxID..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none placeholder:text-gray-600"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Proof Image (Optional)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                                                className="block w-full text-[10px] text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary-600/20 file:text-primary-400 hover:file:bg-primary-600/30 transition-all border border-white/10 rounded-lg p-1"
                                            />
                                        </div>
                                        <button
                                            onClick={handlePaymentSubmit}
                                            disabled={isPaying}
                                            className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            {isPaying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                            Submit Payment Details
                                        </button>
                                    </div>
                                )}

                                {/* Admin Action Bar */}
                                {user?.role === "admin" && (
                                    <div className="pt-4 border-t border-white/10 flex gap-3">
                                        <button
                                            onClick={handleOpenManage}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-sm font-bold transition-all"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                            Admin: Manage Order
                                        </button>
                                    </div>
                                )}

                                {/* Nudge if no deliverable yet */}
                                {selectedOrder.status !== "Completed" && !selectedOrder.deliverableLink && !selectedOrder.liveLink && (
                                    <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-gray-500">
                                        <Clock className="w-4 h-4 shrink-0" />
                                        Our team is working on your project. Deliverables will appear here once ready.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
