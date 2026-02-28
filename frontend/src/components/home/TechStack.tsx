"use client";

import { motion } from "framer-motion";
import { MonitorSmartphone, LayoutTemplate, Database, Server, Cog, Palette } from "lucide-react";

export default function TechStack() {
    const stack = [
        { title: "Frontend", icon: <LayoutTemplate size={24} />, desc: "Next.js, React, TypeScript, Tailwind CSS, Framer Motion." },
        { title: "Backend", icon: <Server size={24} />, desc: "Node.js, Express, REST APIs, GraphQL, Websockets." },
        { title: "Database", icon: <Database size={24} />, desc: "MongoDB, PostgreSQL, Mongoose, Prisma ORM." },
        { title: "UI / UX", icon: <Palette size={24} />, desc: "Figma, Responsive Design, Glassmorphism, Dark Themes." },
        { title: "DevOps", icon: <Cog size={24} />, desc: "Vercel, Heroku, Docker, Git, CI/CD." },
        { title: "Mobile Apps", icon: <MonitorSmartphone size={24} />, desc: "React Native, Progressive Web Apps (PWA)." },
    ];

    return (
        <section className="py-24 relative bg-surface-light border-y border-white/5">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">My Tech <span className="text-primary-400">Stack</span></h2>
                    <p className="text-gray-400 text-lg">The tools and technologies I use to forge modern digital experiences.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stack.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-6 border border-white/5 hover:border-primary-500/20 hover:bg-white/[0.02] transition-colors group flex items-start gap-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
