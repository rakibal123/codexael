"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import {
    Loader2, FileText, Clock, CheckCircle, Settings2, X,
    Link as LinkIcon, ExternalLink, ChevronDown, FolderOpen,
    Calendar, CreditCard, ArrowRight, Zap, Paperclip,
    Archive, Image as ImageIcon, Download, Eye, Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; badge: string; select: string }> = {
    "Pending": {
        label: "Pending",
        icon: <Clock className="w-3.5 h-3.5" />,
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
        select: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    "In Progress": {
        label: "In Progress",
        icon: <Zap className="w-3.5 h-3.5" />,
        badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
        select: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    "Completed": {
        label: "Completed",
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
        select: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
};

const getStatusBadge = (status: string) => {
    const cfg = statusConfig[status] || { label: status, icon: null, badge: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

const getAttachmentIcon = (path: string) => {
    if (/\.(png|jpg|jpeg|gif|webp)$/i.test(path)) return <ImageIcon className="w-4 h-4 text-primary-400 shrink-0" />;
    if (/\.zip$/i.test(path)) return <Archive className="w-4 h-4 text-amber-400 shrink-0" />;
    return <FileText className="w-4 h-4 text-gray-400 shrink-0" />;
};

const getAttachmentLabel = (path: string) => path.split("/").pop() || path;

const downloadFile = async (url: string, filename: string) => {
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
    } catch {
        toast.error("Failed to download file");
    }
};

const isPaid = (order: any) =>
    !!(order.transactionId || order.paymentProof || order.paymentLink);

const PaymentBadge = ({ order }: { order: any }) =>
    isPaid(order) ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            ✓ Paid
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/25">
            ✗ Due
        </span>
    );

// ── MODAL COMPONENTS (Refactored for robust scrolling) ──

const ViewModal = ({ order, onClose }: { order: any; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 cursor-pointer" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-2xl relative z-50 cursor-default"
            >
                <div className="bg-[#0f1623] border border-white/10 rounded-3xl sm:rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-primary-400" /> Order Details
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">{order.userId?.name} · {order.projectType}</p>
                            </div>
                            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-1 rounded-2xl bg-white/[0.03] border border-white/8 divide-y divide-white/5 mb-5">
                            <div className="px-4 py-3 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm border border-primary-500/20 shrink-0">
                                    {(order.userId?.name || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{order.userId?.name || "Unknown"}</p>
                                    <p className="text-xs text-gray-500">{order.userId?.email || ""}</p>
                                </div>
                                <div className="ml-auto">{getStatusBadge(order.status)}</div>
                            </div>

                            {order.title && (
                                <div className="px-4 py-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Title</p>
                                    <p className="text-sm text-white">{order.title}</p>
                                </div>
                            )}

                            {order.description && (
                                <div className="px-4 py-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{order.description}</p>
                                </div>
                            )}

                            {order.techPreference && (
                                <div className="px-4 py-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Tech Preference</p>
                                    <p className="text-sm text-white">{order.techPreference}</p>
                                </div>
                            )}

                            <div className="px-4 py-3 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Budget</p>
                                    <p className="text-sm text-white">{order.budget || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Deadline</p>
                                    <p className="text-sm text-white">
                                        {order.deadline ? new Date(order.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Submitted</p>
                                <p className="text-sm text-white">
                                    {new Date(order.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Paperclip className="w-3.5 h-3.5" />
                                Attached Files {order.attachments?.length > 0 ? `(${order.attachments.length})` : ""}
                            </h3>

                            {!order.attachments || order.attachments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-gray-600">
                                    <Paperclip className="w-8 h-8 mb-2 opacity-40" />
                                    <p className="text-sm">No files attached to this order</p>
                                </div>
                            ) : (
                                <>
                                    <ul className="space-y-2">
                                        {order.attachments.map((path: string, i: number) => {
                                            const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(path);
                                            const fullUrl = path.startsWith("http") ? path : `${API_URL}${path}`;
                                            return (
                                                <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {getAttachmentIcon(path)}
                                                        <span className="text-sm text-white truncate">{getAttachmentLabel(path)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {isImage && (
                                                            <a href={fullUrl} target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                                                <ExternalLink className="w-3.5 h-3.5" /> Preview
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => downloadFile(path.startsWith("http") ? path : `${API_URL}${path}`, getAttachmentLabel(path))}
                                                            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 transition-all"
                                                        >
                                                            <Download className="w-3.5 h-3.5" /> Download
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {order.attachments.some((p: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(p)) && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {order.attachments
                                                .filter((p: string) => /\.(png|jpg|jpeg|gif|webp)$/i.test(p))
                                                .map((path: string, i: number) => (
                                                    <a key={i} href={path.startsWith("http") ? path : `${API_URL}${path}`} target="_blank" rel="noopener noreferrer"
                                                        className="block rounded-xl overflow-hidden border border-white/10 hover:border-primary-500/40 transition-colors group">
                                                        <img
                                                            src={path.startsWith("http") ? path : `${API_URL}${path}`}
                                                            alt={getAttachmentLabel(path)}
                                                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </a>
                                                ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/8 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
);

interface ManageModalProps {
    order: any;
    onClose: () => void;
    statusInput: string;
    setStatusInput: (s: string) => void;
    paymentLinkInput: string;
    setPaymentLinkInput: (s: string) => void;
    deliverableLinkInput: string;
    setDeliverableLinkInput: (s: string) => void;
    liveLinkInput: string;
    setLiveLinkInput: (s: string) => void;
    githubLinkInput: string;
    setGithubLinkInput: (s: string) => void;
    previewImageInput: string;
    setPreviewImageInput: (s: string) => void;
    setPreviewFile: (f: File | null) => void;
    isSaving: boolean;
    onUpdate: () => void;
}

const ManageModal = ({
    order, onClose, statusInput, setStatusInput,
    paymentLinkInput, setPaymentLinkInput,
    deliverableLinkInput, setDeliverableLinkInput,
    liveLinkInput, setLiveLinkInput,
    githubLinkInput, setGithubLinkInput,
    previewImageInput, setPreviewImageInput,
    setPreviewFile, isSaving, onUpdate
}: ManageModalProps) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 cursor-pointer" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-xl relative z-50 cursor-default"
            >
                <div className="bg-[#0f1623] border border-white/10 rounded-3xl sm:rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col">
                    <div className="sticky top-0 bg-[#0f1623] border-b border-white/8 px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl sm:rounded-t-2xl">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-primary-400" /> Manage Order
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">{order.userId?.name} · {order.projectType}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-primary-400 inline-block"></span>
                                Order Status
                                {order.status === 'Completed' && <span className="text-emerald-500 text-xs font-normal">🔒 Locked</span>}
                            </label>
                            <select
                                className={`w-full bg-[#1a2332] border-2 rounded-xl px-4 h-[44px] text-white text-sm font-medium focus:outline-none transition-colors duration-200
                                ${order.status === 'Completed'
                                        ? 'border-white/10 opacity-50 cursor-not-allowed'
                                        : 'border-white/20 hover:border-primary-500/50 focus:border-primary-500 cursor-pointer'
                                    }`}
                                value={statusInput}
                                disabled={order.status === 'Completed'}
                                onChange={(e) => setStatusInput(e.target.value)}
                            >
                                <option value="Pending" className="bg-[#0f1623]">⏳ Pending</option>
                                <option value="In Progress" className="bg-[#0f1623]">🔄 In Progress</option>
                                <option value="Completed" className="bg-[#0f1623]">✅ Completed</option>
                            </select>
                        </div>

                        <div className="border-t border-white/8 pt-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Links for Client</p>

                            <div className="space-y-2 mb-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                    <CreditCard className="w-4 h-4 text-primary-400" /> Payment Link
                                    <span className="text-gray-600 text-xs font-normal">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://paypal.me/... or Stripe Invoice URL"
                                    className="w-full px-4 h-[44px] rounded-xl bg-[#1a2332] border-2 border-white/20 hover:border-primary-500/40 focus:border-primary-500 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors duration-200"
                                    value={paymentLinkInput}
                                    onChange={(e) => setPaymentLinkInput(e.target.value)}
                                    autoComplete="off"
                                />
                                {(order.transactionId || order.paymentProof) && (
                                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span className="text-emerald-400 font-semibold text-xs">Client payment submitted · {order.paymentType}</span>
                                        {order.transactionId && <span className="font-mono text-xs text-gray-400 bg-black/20 px-2 py-0.5 rounded">ID: {order.transactionId}</span>}
                                        {order.paymentProof && (
                                            <a href={order.paymentProof.startsWith("http") ? order.paymentProof : `${API_URL}${order.paymentProof}`} target="_blank" rel="noopener noreferrer"
                                                className="text-xs text-primary-400 hover:underline flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" /> View Proof
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 mb-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                    <Download className="w-4 h-4 text-emerald-400" /> Deliverable / Project Files Link
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/... or Dropbox"
                                    className="w-full px-4 h-[44px] rounded-xl bg-[#1a2332] border-2 border-white/20 hover:border-emerald-500/40 focus:border-emerald-500 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors duration-200"
                                    value={deliverableLinkInput}
                                    onChange={(e) => setDeliverableLinkInput(e.target.value)}
                                    autoComplete="off"
                                />
                                <p className="text-xs text-gray-600">Client sees this once status is set to Completed.</p>
                            </div>

                            <div className="space-y-2 mb-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                    <ExternalLink className="w-4 h-4 text-blue-400" /> Live Demo Link
                                    <span className="text-gray-600 text-xs font-normal">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://yourapp.vercel.app"
                                    className="w-full px-4 h-[44px] rounded-xl bg-[#1a2332] border-2 border-white/20 hover:border-blue-500/40 focus:border-blue-500 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors duration-200"
                                    value={liveLinkInput}
                                    onChange={(e) => setLiveLinkInput(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="space-y-2 mb-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                    <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                    GitHub Code Link
                                    <span className="text-gray-600 text-xs font-normal">(optional)</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    className="w-full px-4 h-[44px] rounded-xl bg-[#1a2332] border-2 border-white/20 hover:border-gray-500/40 focus:border-gray-400 text-white text-sm placeholder:text-gray-600 focus:outline-none transition-colors duration-200"
                                    value={githubLinkInput}
                                    onChange={(e) => setGithubLinkInput(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                                    <ImageIcon className="w-4 h-4 text-purple-400" /> Preview Screenshot
                                    <span className="text-gray-600 text-xs font-normal">(optional)</span>
                                </label>
                                <label className="flex flex-col items-center justify-center w-full h-[112px] rounded-xl bg-[#1a2332] border-2 border-dashed border-white/20 hover:border-purple-500/50 cursor-pointer transition-colors duration-200 group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setPreviewFile(file);
                                            if (file) setPreviewImageInput(URL.createObjectURL(file));
                                        }}
                                    />
                                    {previewImageInput ? (
                                        <img src={previewImageInput} alt="preview"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                            className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-gray-500 group-hover:text-purple-400 transition-colors">
                                            <ImageIcon className="w-7 h-7" />
                                            <span className="text-xs font-medium">Click to upload screenshot</span>
                                            <span className="text-[10px]">PNG, JPG, WEBP</span>
                                        </div>
                                    )}
                                </label>
                                {previewImageInput && (
                                    <button onClick={() => { setPreviewImageInput(""); setPreviewFile(null); }}
                                        className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                                        <X className="w-3 h-3" /> Remove screenshot
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button onClick={onClose}
                                className="flex-1 px-4 h-[48px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold transition-colors duration-200 text-sm">
                                Cancel
                            </button>
                            <button onClick={onUpdate}
                                disabled={isSaving || order.status === 'Completed'}
                                className="flex-1 px-4 h-[48px] rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary-500/20 text-sm">
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
);

export default function AdminOrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewOrder, setViewOrder] = useState<any>(null);
    const [manageOrder, setManageOrder] = useState<any>(null);

    const [statusInput, setStatusInput] = useState("");
    const [paymentLinkInput, setPaymentLinkInput] = useState("");
    const [deliverableLinkInput, setDeliverableLinkInput] = useState("");
    const [liveLinkInput, setLiveLinkInput] = useState("");
    const [githubLinkInput, setGithubLinkInput] = useState("");
    const [previewImageInput, setPreviewImageInput] = useState("");
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            const res = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) fetchOrders();
    }, [user]);

    const openManage = (order: any) => {
        setManageOrder(order);
        setStatusInput(order.status);
        setPaymentLinkInput(order.paymentLink || "");
        setDeliverableLinkInput(order.deliverableLink || "");
        setLiveLinkInput(order.liveLink || "");
        setGithubLinkInput(order.githubLink || "");
        setPreviewImageInput(order.previewImage || "");
        setPreviewFile(null);
    };

    const handleUpdateOrder = async () => {
        setIsSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            let finalPreviewImage = previewImageInput;
            if (previewFile) {
                const fd = new FormData();
                fd.append('previewImage', previewFile);
                const uploadRes = await axios.post(
                    `${API_URL}/api/orders/${manageOrder._id}/preview`,
                    fd,
                    { headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data' } }
                );
                finalPreviewImage = uploadRes.data.previewImage;
            }

            await axios.put(`${API_URL}/api/orders/${manageOrder._id}`, {
                status: statusInput,
                paymentLink: paymentLinkInput,
                deliverableLink: deliverableLinkInput,
                liveLink: liveLinkInput,
                githubLink: githubLinkInput,
                previewImage: finalPreviewImage,
            }, config);
            toast.success("Order updated successfully");
            setManageOrder(null);
            setPreviewFile(null);
            fetchOrders();
        } catch {
            toast.error("Failed to update order");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteOrder = async (orderId: string, clientName: string) => {
        if (!confirm(`Delete order from "${clientName}"? This cannot be undone.`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.delete(`${API_URL}/api/orders/${orderId}`, config);
            toast.success('Order deleted');
            setOrders(prev => prev.filter(o => o._id !== orderId));
        } catch {
            toast.error('Failed to delete order');
        }
    };

    const handleInlineStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.put(`${API_URL}/api/orders/${orderId}`, { status: newStatus }, config);
            setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Status → "${newStatus}"`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const StatusSelect = ({ order }: { order: any }) => {
        const cfg = statusConfig[order.status];
        return (
            <div className="relative">
                <select
                    value={order.status}
                    disabled={order.status === 'Completed'}
                    onChange={(e) => handleInlineStatusUpdate(order._id, e.target.value)}
                    className={`appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-semibold border transition-colors duration-200 focus:outline-none
                        ${order.status === 'Completed' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                        ${cfg?.select || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}
                >
                    <option value="Pending" className="bg-gray-900 text-yellow-400">⏳ Pending</option>
                    <option value="In Progress" className="bg-gray-900 text-blue-400">🔄 In Progress</option>
                    <option value="Completed" className="bg-gray-900 text-green-400">✅ Completed</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Orders</h1>
                    <p className="text-gray-400 mt-1.5 text-sm sm:text-base">View and update client project requests.</p>
                </div>
                <Link href="/dashboard/admin/projects"
                    className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-primary-600/90 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] shrink-0">
                    <FolderOpen className="w-4 h-4" />
                    Manage Projects
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {!loading && orders.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total", count: orders.length, color: "text-white", bg: "bg-white/5" },
                        { label: "Pending", count: orders.filter(o => o.status === "Pending").length, color: "text-amber-400", bg: "bg-amber-500/10" },
                        { label: "Completed", count: orders.filter(o => o.status === "Completed").length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    ].map((s) => (
                        <div key={s.label} className={`glass-card rounded-2xl p-3 sm:p-4 border border-white/5 ${s.bg} text-center`}>
                            <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.count}</p>
                            <p className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
            ) : orders.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No orders found</h3>
                    <p className="text-gray-400 max-w-sm">No clients have placed any requests yet.</p>
                </div>
            ) : (
                <>
                    <div className="hidden md:block glass-card rounded-2xl border border-white/5 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[780px]">
                            <thead>
                                <tr className="border-b border-white/8 bg-white/[0.03]">
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Project</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                                    <th className="px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs border border-primary-500/20 shrink-0">
                                                    {(order.userId?.name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{order.userId?.name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-500">{order.userId?.email || ""}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-white text-sm">{order.projectType}</p>
                                            {order.title && <p className="text-xs text-gray-500 mt-0.5">{order.title}</p>}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusSelect order={order} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <PaymentBadge order={order} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setViewOrder(order)}
                                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-primary-500/15 border border-white/10 hover:border-primary-500/30 text-gray-300 hover:text-primary-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </button>
                                                <button
                                                    onClick={() => openManage(order)}
                                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-gray-300 hover:text-amber-400 text-xs font-semibold transition-all flex items-center gap-1.5"
                                                >
                                                    <Settings2 className="w-3.5 h-3.5" /> Manage
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order._id, order.userId?.name)}
                                                    className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-500 hover:text-red-400 transition-all"
                                                    title="Delete order"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-3">
                        {orders.map((order: any, idx: number) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.04 }}
                                className="glass-card rounded-2xl border border-white/5 overflow-hidden"
                            >
                                <div className={`h-1 w-full ${order.status === "Completed" ? "bg-emerald-500/60" : order.status === "In Progress" ? "bg-blue-500/60" : "bg-amber-500/60"}`} />
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-9 h-9 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-sm border border-primary-500/20 shrink-0">
                                                {(order.userId?.name || "?").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white text-sm truncate">{order.userId?.name || "Unknown Client"}</p>
                                                <p className="text-xs text-gray-500 truncate">{order.userId?.email || ""}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-3 py-2">
                                        <FolderOpen className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-white text-sm">{order.projectType}</p>
                                            {order.title && <p className="text-xs text-gray-500 truncate">{order.title}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        {getStatusBadge(order.status)}
                                        <PaymentBadge order={order} />
                                        {order.attachments?.length > 0 && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 font-semibold">
                                                <Paperclip className="w-3 h-3" /> {order.attachments.length} file{order.attachments.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                                        <StatusSelect order={order} />
                                        <div className="flex gap-2 ml-auto">
                                            <button
                                                onClick={() => setViewOrder(order)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600/15 hover:bg-primary-600/30 border border-primary-500/20 text-primary-400 text-xs font-bold transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </button>
                                            <button
                                                onClick={() => openManage(order)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold transition-all"
                                            >
                                                <Settings2 className="w-3.5 h-3.5" /> Manage
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(order._id, order.userId?.name)}
                                                className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-gray-500 hover:text-red-400 transition-all"
                                                title="Delete order"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            <AnimatePresence>
                {viewOrder && <ViewModal order={viewOrder} onClose={() => setViewOrder(null)} />}
            </AnimatePresence>
            <AnimatePresence>
                {manageOrder && (
                    <ManageModal
                        order={manageOrder}
                        onClose={() => setManageOrder(null)}
                        statusInput={statusInput}
                        setStatusInput={setStatusInput}
                        paymentLinkInput={paymentLinkInput}
                        setPaymentLinkInput={setPaymentLinkInput}
                        deliverableLinkInput={deliverableLinkInput}
                        setDeliverableLinkInput={setDeliverableLinkInput}
                        liveLinkInput={liveLinkInput}
                        setLiveLinkInput={setLiveLinkInput}
                        githubLinkInput={githubLinkInput}
                        setGithubLinkInput={setGithubLinkInput}
                        previewImageInput={previewImageInput}
                        setPreviewImageInput={setPreviewImageInput}
                        setPreviewFile={setPreviewFile}
                        isSaving={isSaving}
                        onUpdate={handleUpdateOrder}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
