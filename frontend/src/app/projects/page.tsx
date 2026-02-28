"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_URL = "http://localhost:5000";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search and Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTech, setSelectedTech] = useState("All");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/projects`);
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter logic
    const allTechs = ["All", ...Array.from(new Set(projects.flatMap((p: any) => p.techStack || [])))];

    const filteredProjects = projects.filter((project: any) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTech = selectedTech === "All" || (project.techStack && project.techStack.includes(selectedTech));

        return matchesSearch && matchesTech;
    });

    return (
        <>
            <Navbar />
            <div className="pt-32 pb-20 min-h-screen">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our <span className="text-primary-400">Projects</span></h1>
                        <p className="text-lg text-gray-400 mb-8">
                            Explore our full portfolio of premium web applications, bespoke design systems, and enterprise-grade solutions.
                        </p>

                        {/* Search and Filter Section (Hidden on Desktop per request) */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6 md:hidden">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* Tech Stack Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                            {allTechs.map((tech: any) => (
                                <button
                                    key={tech}
                                    onClick={() => setSelectedTech(tech)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedTech === tech
                                        ? "bg-primary-500 text-white border-primary-500"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    {tech}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((idx) => (
                                <div key={idx} className="rounded-2xl overflow-hidden glass-card border border-white/5 flex flex-col animate-pulse">
                                    <div className="aspect-video w-full bg-white/5" />
                                    <div className="p-6">
                                        <div className="h-6 bg-white/5 rounded-md w-3/4 mb-4" />
                                        <div className="h-4 bg-white/5 rounded-md w-full mb-2" />
                                        <div className="h-4 bg-white/5 rounded-md w-5/6 mb-6" />
                                        <div className="flex gap-2 mb-6">
                                            <div className="h-6 w-16 bg-white/5 rounded-md" />
                                            <div className="h-6 w-20 bg-white/5 rounded-md" />
                                        </div>
                                        <div className="h-10 bg-white/5 rounded-xl w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="glass-card rounded-3xl border border-white/5 p-12 text-center">
                            <h3 className="text-xl font-bold mb-2">Projects coming soon</h3>
                            <p className="text-gray-400">We are currently gathering our best work for display.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project: any, index: number) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group rounded-2xl overflow-hidden glass-card border border-white/5 flex flex-col cursor-pointer"
                                >
                                    <Link href={`/projects/${project._id}`} className="block relative aspect-video overflow-hidden bg-surface-light shrink-0">
                                        <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors z-10"></div>
                                        {project.image ? (
                                            <img
                                                src={project.image.startsWith("http") ? project.image : `${API_URL}${project.image}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                        )}
                                    </Link>

                                    <div className="p-4 md:p-6 flex flex-col flex-1">
                                        <Link href={`/projects/${project._id}`}>
                                            <h3 className="text-lg md:text-xl font-bold text-white mb-1.5 group-hover:text-primary-400 transition-colors">{project.title}</h3>
                                        </Link>
                                        <p className="text-gray-400 mb-4 line-clamp-3 text-xs md:text-sm flex-1">{project.description}</p>

                                        <div className="flex flex-wrap gap-1.5 mb-4 max-h-16 overflow-hidden">
                                            {project.techStack?.map((tech: string) => (
                                                <span key={tech} className="text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-auto">
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center px-3 py-2 rounded-xl bg-primary-600/10 text-primary-400 hover:bg-primary-600 hover:text-white transition-colors text-xs font-medium border border-primary-500/20"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                                    Live
                                                </a>
                                            )}
                                            {/* Assuming githubLink exists on the model, or rendering standard Github link button */}
                                            <a
                                                href={project.githubLink || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center px-3 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium border border-white/10"
                                            >
                                                <Github className="w-3.5 h-3.5 mr-1.5" />
                                                GitHub
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
