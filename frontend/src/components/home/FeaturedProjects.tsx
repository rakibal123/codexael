"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/projects");
                // Limit to 3 projects for featured section
                setProjects(res.data.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch featured projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <section className="py-24 relative" id="portfolio">
            <div className="container mx-auto px-6 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 md:flex md:items-end md:justify-between"
                >
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured <span className="text-primary-400">Projects</span></h2>
                        <p className="text-gray-400 text-lg">A selection of my best work, showcasing deep dives into complex problems and beautiful solutions.</p>
                    </div>
                    <Link href="/projects" className="hidden md:inline-flex items-center text-primary-400 font-medium hover:text-primary-300 transition-colors group">
                        View All Projects
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-2xl glass-card border border-white/5 animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project: any, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group rounded-2xl overflow-hidden glass-card border border-white/5 cursor-pointer"
                            >
                                <div className="relative aspect-video overflow-hidden bg-surface-light">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <div className="flex gap-3">
                                            {project.liveLink && (
                                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg">
                                                <Github className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image provided</div>
                                    )}
                                </div>

                                <div className="p-4 md:p-6 flex flex-col flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 group-hover:text-primary-400 transition-colors">{project.title}</h3>
                                    <p className="text-gray-400 mb-4 line-clamp-2 text-xs md:text-sm">{project.description}</p>

                                    <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                                        {project.techStack?.map((tech: string) => (
                                            <span key={tech} className="text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link href="/projects" className="inline-flex flex-col items-center justify-center w-full glass-card p-4 rounded-xl text-primary-400 font-medium border border-white/5 hover:bg-white/5 transition-colors group">
                        View All Projects
                        <ArrowRight className="w-5 h-5 mt-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
