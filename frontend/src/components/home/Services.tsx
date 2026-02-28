"use client";

import { motion } from "framer-motion";
import { Code, MonitorSmartphone, Palette, Search, Server, Zap } from "lucide-react";

const services = [
    {
        icon: <MonitorSmartphone className="w-8 h-8 text-primary-400" />,
        title: "Web Development",
        description: "Custom, responsive web applications built with Next.js and React. SEO optimized and blazing fast.",
    },
    {
        icon: <Palette className="w-8 h-8 text-accent" />,
        title: "UI/UX Design",
        description: "Premium user interfaces and engaging user experiences tailored to your brand identity.",
    },
    {
        icon: <Server className="w-8 h-8 text-purple-400" />,
        title: "Backend Systems",
        description: "Scalable Node.js architectures, secure RESTful APIs, and efficient database designs.",
    },
    {
        icon: <Zap className="w-8 h-8 text-yellow-400" />,
        title: "Performance Optimization",
        description: "Speeding up existing applications to improve user retention and search rankings.",
    },
    {
        icon: <Search className="w-8 h-8 text-blue-400" />,
        title: "SEO Strategy",
        description: "Technical SEO implementation ensuring your site ranks higher on search engines.",
    },
    {
        icon: <Code className="w-8 h-8 text-pink-400" />,
        title: "Maintenance & Support",
        description: "Ongoing updates, bug fixes, and continuous improvements for your digital products.",
    },
];

export default function Services() {
    return (
        <section id="services" className="py-24 relative bg-surface">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Expertise & <span className="text-primary-400">Services</span></h2>
                    <p className="text-gray-400 text-lg">
                        Comprehensive digital solutions designed to elevate your business and provide a competitive edge in your market.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card p-8 rounded-2xl group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
