"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, UploadCloud, CheckCircle2, X, FileText, Archive } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function NewOrderPage() {
    const { user } = useAuthStore();

    // Form fields
    const [projectType, setProjectType] = useState("");
    const [customProjectType, setCustomProjectType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techPreference, setTechPreference] = useState("");
    const [budget, setBudget] = useState("");
    const [deadline, setDeadline] = useState("");

    // Multiple file uploads
    const [files, setFiles] = useState<File[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selected = Array.from(e.target.files);
        setFiles(prev => {
            // Merge, avoiding duplicates by name
            const existing = new Set(prev.map(f => f.name));
            return [...prev, ...selected.filter(f => !existing.has(f.name))];
        });
    };

    const removeFile = (name: string) => {
        setFiles(prev => prev.filter(f => f.name !== name));
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/")) return <UploadCloud className="w-4 h-4 text-primary-400" />;
        if (file.name.endsWith(".zip")) return <Archive className="w-4 h-4 text-amber-400" />;
        return <FileText className="w-4 h-4 text-gray-400" />;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectType) {
            toast.error("Please select a project type.");
            return;
        }

        setIsSubmitting(true);

        try {
            const finalProjectType = projectType === "Other" ? customProjectType : projectType;

            // Use FormData so we can upload files along with text fields
            const formData = new FormData();
            formData.append("projectType", finalProjectType);
            if (title) formData.append("title", title);
            formData.append("description", description);
            if (techPreference) formData.append("techPreference", techPreference);
            formData.append("budget", budget);
            if (deadline) formData.append("deadline", new Date(deadline).toISOString());

            // Append each file under the "attachments" key (matches multer field name)
            files.forEach(file => formData.append("attachments", file));

            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    // DO NOT set Content-Type manually — axios sets the correct
                    // multipart/form-data boundary automatically when using FormData
                },
            };

            await axios.post("http://localhost:5000/api/orders", formData, config);

            toast.success("Order request submitted successfully!");
            setIsSuccess(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit order request");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto pt-20 animate-in zoom-in-95 duration-500">
                <div className="glass-card p-12 rounded-[2.5rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">Order Received!</h2>
                        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                            Thank you for your submission. Your order has been placed into <span className="text-primary-400 font-semibold">Pending</span> status. We will review your requirements and follow up with you shortly.
                        </p>
                        <button
                            onClick={() => window.location.href = '/dashboard/orders'}
                            className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold">Initiate New Project</h1>
                <p className="text-gray-400 mt-2">Fill out the specifications below to place a formal work order into our pipeline.</p>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Core Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Core Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                                <select
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled hidden className="text-gray-500">Select Type</option>
                                    <option value="Web Application" className="bg-gray-900 text-white">Web Application</option>
                                    <option value="Mobile Application" className="bg-gray-900 text-white">Mobile Application</option>
                                    <option value="Landing Page" className="bg-gray-900 text-white">Landing Page</option>
                                    <option value="Backend API" className="bg-gray-900 text-white">Backend API Architecture</option>
                                    <option value="UI/UX Design" className="bg-gray-900 text-white">UI/UX Design</option>
                                    <option value="Consulting" className="bg-gray-900 text-white">Consulting / DevOps</option>
                                    <option value="Other" className="bg-gray-900 text-white">Other (Please specify)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Title <span className="text-gray-500 font-normal">(optional)</span></label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. E-commerce Platform Redesign"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                                />
                            </div>

                            {projectType === "Other" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="md:col-span-2 mt-4"
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Specify Project Type</label>
                                    <input
                                        type="text"
                                        value={customProjectType}
                                        onChange={(e) => setCustomProjectType(e.target.value)}
                                        required={projectType === "Other"}
                                        placeholder="e.g. Desktop Software, Chrome Extension"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                                    />
                                </motion.div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Requirements (Description)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500 resize-none"
                                placeholder="Please provide specific goals, required pages, and core functionality..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tech Preference <span className="text-gray-500 font-normal">(optional)</span></label>
                            <input
                                type="text"
                                value={techPreference}
                                onChange={(e) => setTechPreference(e.target.value)}
                                placeholder="e.g. React, Node.js, PostgreSQL"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Section 2: Scope & Logistics */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Scope & Logistics</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
                                <input
                                    type="text"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    required
                                    placeholder="e.g. $2,000 - $3,500"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Target Deadline <span className="text-gray-500 font-normal">(it will take 5-7 days)</span></label>
                                <input
                                    type="date"
                                    value={deadline}
                                    min={(() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 7);
                                        return d.toISOString().split("T")[0];
                                    })()}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all [color-scheme:dark] cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: File Attachments */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Reference Files <span className="text-gray-500 text-sm font-normal">(optional)</span></h3>

                        <label className={`w-full border-2 ${files.length > 0 ? 'border-primary-500 bg-primary-500/5' : 'border-dashed border-white/10 bg-white/5'} rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-colors cursor-pointer group relative`}>
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                                accept=".pdf,.png,.jpg,.jpeg,.zip"
                            />
                            <UploadCloud className={`w-10 h-10 mb-3 transition-transform group-hover:-translate-y-1 ${files.length > 0 ? 'text-primary-500' : ''}`} />
                            <p className="text-sm font-medium mb-1 text-white">
                                Click to upload files or drag & drop
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, PDF or ZIP (max. 10MB each, up to 5 files)
                            </p>
                        </label>

                        {/* Selected files list */}
                        <AnimatePresence>
                            {files.length > 0 && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="space-y-2"
                                >
                                    {files.map((file) => (
                                        <motion.li
                                            key={file.name}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {getFileIcon(file)}
                                                <span className="text-sm text-white truncate">{file.name}</span>
                                                <span className="text-xs text-gray-500 shrink-0">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(file.name)}
                                                className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Submit Area */}
                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : null}
                            {isSubmitting ? "Processing Order..." : "Confirm & Submit Order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
