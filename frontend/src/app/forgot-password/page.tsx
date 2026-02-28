"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await axios.post("http://localhost:5000/api/users/password/forgotpassword", { email });
            setSuccessMessage(res.data.message || "Password reset link sent to your email.");
            // In development, normally we check console or response for the mock URL to click
            console.log("Mock Email Data:", res.data.mockEmailData);
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="glass-card p-10 rounded-3xl border border-white/10">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                        <p className="text-gray-400">Enter your email to receive a reset link</p>
                    </div>

                    {successMessage ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <p className="text-gray-300">{successMessage}</p>
                            <p className="text-sm text-primary-400">
                                *Check your development console for the mock reset link!
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
