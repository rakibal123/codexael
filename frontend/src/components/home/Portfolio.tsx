"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const projects = [
    {
        title: "E-Commerce Platform",
        category: "Full Stack Development",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        link: "#",
    },
    {
        title: "FinTech Dashboard",
        category: "UI/UX & Frontend",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        link: "#",
    },
    {
        title: "Real Estate Portal",
        category: "Web Application",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        link: "#",
    },
    {
        title: "AI Startup Landing",
        category: "Web Design",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        link: "#",
    },
];

export default function Portfolio() {
    return (
        <section id="portfolio" className="py-24 relative">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Selected <span className="text-accent">Works</span></h2>
                        <p className="text-gray-400 text-lg">
                            A showcase of recent projects blending rigorous technical architecture with refined aesthetics.
                        </p>
                    </div>
                    <Link href="/portfolio" className="text-primary-400 font-medium hover:text-white transition-colors flex items-center gap-2">
                        View all projects <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative rounded-3xl overflow-hidden glass border-white/10"
                        >
                            <div className="aspect-[4/3] w-full relative overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-primary-400 font-medium mb-2">{project.category}</p>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                                    <Link href={project.link} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors backdrop-blur-md">
                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
