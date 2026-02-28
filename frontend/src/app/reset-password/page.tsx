"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError("Invalid or missing reset token. Please request a new link.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await axios.put(`${API_URL}/api/users/password/resetpassword/${token}`, { password });
            setSuccessMessage(res.data.message || "Password updated successfully");

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. The token may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-card p-10 rounded-3xl border border-white/10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
                <p className="text-gray-400">Please enter your new strong password</p>
            </div>

            {successMessage ? (
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <p className="text-gray-300 mb-6">{successMessage}</p>
                    <p className="text-sm text-primary-400">Redirecting to login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !password || !confirmPassword}
                        className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <Suspense fallback={<div className="glass-card p-10 rounded-3xl border border-white/10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
