"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Loader2, CreditCard, ExternalLink, ShieldCheck, Upload, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [paymentType, setPaymentType] = useState("bKash");
    const [transactionId, setTransactionId] = useState("");
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const res = await axios.get(`${API_URL}/api/orders/myorders`, config);
            // Include active orders OR orders that have payment explicitly linked.
            // Even if paid, we might want to show them if status is not completed yet.
            setOrders(res.data.filter((order: any) => order.status !== "Completed" || order.paymentLink));
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchOrders();
        }
    }, [user]);

    const openPaymentModal = (order: any) => {
        setSelectedOrder(order);
        setPaymentType("bKash");
        setTransactionId("");
        setPaymentProof(null);
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentProof && !transactionId) {
            toast.error("Please provide either a Transaction ID or a Proof Screenshot");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("paymentType", paymentType);
            if (transactionId) formData.append("transactionId", transactionId);
            if (paymentProof) formData.append("paymentProof", paymentProof);

            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data'
                },
            };
            await axios.post(`${API_URL}/api/orders/${selectedOrder._id}/pay`, formData, config);
            toast.success("Payment proof submitted successfully! Awaiting admin confirmation.");
            setSelectedOrder(null);
            fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    Payments & Invoices <CreditCard className="w-8 h-8 text-primary-400" />
                </h1>
                <p className="text-gray-400 mt-2">Manage your active invoices and complete payments securely.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : orders.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No active invoices</h3>
                    <p className="text-gray-400 max-w-sm mb-6">You don't have any pending payments at the moment.</p>
                    <Link
                        href="/dashboard/new-order"
                        className="px-6 py-3 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
                    >
                        Start a Custom Order
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {/* Security Notice */}
                    <div className="glass-card p-4 rounded-xl border border-primary-500/20 bg-primary-900/10 flex items-start gap-4">
                        <ShieldCheck className="w-6 h-6 text-primary-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-white font-medium mb-1">Secure Transactions</h4>
                            <p className="text-sm text-gray-400">All payments are processed securely through our trusted payment partners. We never store your raw credit card information.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs text-primary-400 font-bold uppercase mb-1">Order #{order._id.substring(order._id.length - 6)}</p>
                                        <h3 className="text-lg font-bold text-white leading-tight">{order.projectType}</h3>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="mb-6 flex-1">
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-sm text-gray-500">Budget</span>
                                        <span className="text-sm text-white font-medium">{order.budget || "TBD"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className="text-sm text-white font-medium">{order.status}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {order.paymentLink && (
                                        <a
                                            href={order.paymentLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" /> Pay via Link
                                        </a>
                                    )}

                                    {!order.paymentProof ? (
                                        <button
                                            onClick={() => openPaymentModal(order)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-600/20 text-primary-400 font-bold hover:bg-primary-600/30 transition-colors border border-primary-500/20"
                                        >
                                            <Upload className="w-4 h-4" /> Manual Payment Setup
                                        </button>
                                    ) : (
                                        <div className="w-full text-center px-4 py-3 rounded-xl bg-green-500/10 text-green-400 font-medium border border-green-500/20 text-sm">
                                            Payment Proof Submitted!
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Manual Payment Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface-light border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">Manual Payment</h2>
                        <p className="text-sm text-gray-400 mb-6">Submit proof of manual transfer for Order #{selectedOrder._id.substring(selectedOrder._id.length - 6)}</p>

                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Payment Method</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('bKash')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${paymentType === 'bKash'
                                            ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Mobile Wallet (bKash)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType('Bank Transfer')}
                                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${paymentType === 'Bank Transfer'
                                            ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        Bank Transfer
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-900 border border-white/5 p-4 rounded-xl">
                                <h4 className="text-sm font-bold text-white mb-3">Transfer Details</h4>
                                {paymentType === 'bKash' ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Number</span>
                                            <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded text-primary-400 font-bold tracking-wider">+880 1700 000000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Account Type</span>
                                            <span className="text-white">Personal / Send Money</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Bank Name</span>
                                            <span className="text-white font-medium">Standard Chartered Bank</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Account Name</span>
                                            <span className="text-white">Codexael Agency</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Account No.</span>
                                            <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded text-primary-400 font-bold tracking-wider">1234 5678 9012</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Branch</span>
                                            <span className="text-white">Dhaka Main Branch</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Transaction ID</label>
                                    <input
                                        type="text"
                                        placeholder="Enter TrxID or Reference Number"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-white/10 text-white focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-600"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                </div>

                                <div className="text-center text-sm text-gray-500 font-medium">OR</div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Upload Screenshot (Proof)</label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, application/pdf"
                                        onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-600/20 file:text-primary-400 hover:file:bg-primary-600/30 transition-all file:cursor-pointer cursor-pointer border border-white/10 rounded-xl bg-gray-900"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedOrder(null)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Proof"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
