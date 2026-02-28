"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, ExternalLink, Github, ArrowLeft, Calendar, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id;
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/projects/${id}`);
                setProject(res.data);
            } catch (error) {
                console.error("Failed to fetch project details", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-6">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <p className="text-gray-400 mb-8">The project you are looking for does not exist or has been removed.</p>
                <Link href="/projects" className="px-6 py-3 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors">
                    Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="pt-32 pb-20 min-h-screen">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to all projects
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Project Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-8 glass-card rounded-3xl overflow-hidden border border-white/5 bg-surface-light relative"
                        >
                            <div className="aspect-[16/10] w-full relative">
                                {project.image ? (
                                    <img
                                        src={project.image.startsWith("http") ? project.image : `${API_URL}${project.image}`}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white/5">No Image Available</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Project Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-4 flex flex-col"
                        >
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{project.title}</h1>
                            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="space-y-6 mb-10">
                                <div className="flex items-start gap-4">
                                    <Code2 className="w-6 h-6 text-primary-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack?.map((tech: string) => (
                                                <span key={tech} className="text-xs font-medium px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Calendar className="w-6 h-6 text-primary-400 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Published</h4>
                                        <p className="text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-auto">
                                {project.liveLink && (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center px-6 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                                    >
                                        <ExternalLink className="w-5 h-5 mr-3" />
                                        Visit Live Site
                                    </a>
                                )}
                                <a
                                    href={project.githubLink || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all"
                                >
                                    <Github className="w-5 h-5 mr-3" />
                                    View Source on GitHub
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
