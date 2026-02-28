"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, Server, Database, Layers } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SkillsPage() {
    const skillCategories = [
        {
            title: "Frontend",
            icon: <LayoutTemplate className="w-6 h-6" />,
            skills: [
                { name: "Next.js", level: 95 },
                { name: "React", level: 95 },
                { name: "React Native", level: 85 },
            ]
        },
        {
            title: "Backend",
            icon: <Server className="w-6 h-6" />,
            skills: [
                { name: "Node.js", level: 90 },
                { name: "Express.js", level: 90 },
                { name: "Django", level: 80 },
                { name: "Laravel", level: 75 },
            ]
        },
        {
            title: "Database",
            icon: <Database className="w-6 h-6" />,
            skills: [
                { name: "MongoDB", level: 90 },
                { name: "MySQL", level: 85 },
            ]
        },
        {
            title: "Others",
            icon: <Layers className="w-6 h-6" />,
            skills: [
                { name: "REST API", level: 95 },
                { name: "Authentication", level: 90 },
                { name: "Payment integration", level: 85 },
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <>
            <Navbar />
            <div className="pt-32 pb-20 min-h-screen">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Technical <span className="text-primary-400">Skills</span></h1>
                        <p className="text-lg text-gray-400">
                            A comprehensive overview of my technical proficiencies and capabilities structured across the full development stack.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {skillCategories.map((category, idx) => (
                            <motion.div
                                key={category.title}
                                variants={itemVariants}
                                className="glass-card p-8 rounded-3xl border border-white/5 hover:border-primary-500/20 transition-colors group"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {category.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                                </div>

                                <div className="space-y-6">
                                    {category.skills.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                                                <span className="text-sm font-medium text-primary-400">{skill.level}%</span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${skill.level}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                                    className="bg-gradient-to-r from-primary-600 to-blue-400 h-2.5 rounded-full relative"
                                                >
                                                    <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/20 rounded-full blur-[1px]"></div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
}
