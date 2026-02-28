"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Headphones, Smartphone } from "lucide-react";

export default function WhyChooseMe() {
    const reasons = [
        {
            title: "Lightning Fast Performance",
            desc: "Optimized code, modern frameworks, and CDN delivery ensure your site loads instantly anywhere in the world.",
            icon: <Zap size={28} />,
        },
        {
            title: "Secure & Scalable",
            desc: "Built with enterprise-grade security practices and architectures that grow seamlessly with your business.",
            icon: <ShieldCheck size={28} />,
        },
        {
            title: "100% Responsive Design",
            desc: "Flawless rendering and intuitive UX across all devices, from ultra-wide monitors to mobile screens.",
            icon: <Smartphone size={28} />,
        },
        {
            title: "Clear Communication",
            desc: "I believe in transparency. You'll get regular updates, explicit timelines, and direct support.",
            icon: <Headphones size={28} />,
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -z-10"></div>

            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose <span className="text-primary-400">Me?</span></h2>
                    <p className="text-gray-400 text-lg">Delivering value beyond just code. Here is what you can expect when we collaborate.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex flex-col md:flex-row gap-6 items-start group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white group-hover:bg-primary-600 group-hover:border-primary-500 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300">
                                {reason.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">{reason.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{reason.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
