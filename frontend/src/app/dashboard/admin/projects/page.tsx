"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { Loader2, FolderPlus, PlusCircle, Edit2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

export default function AdminProjectsPage() {
    const { user } = useAuthStore();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [liveLink, setLiveLink] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [techStack, setTechStack] = useState(""); // Comma separated
    const [projectFile, setProjectFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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

    useEffect(() => {
        fetchProjects();
    }, []);

    const openModal = (project?: any) => {
        if (project) {
            setIsEditing(true);
            setCurrentProjectId(project._id);
            setTitle(project.title);
            setDescription(project.description);
            setImage(project.image || "");
            setLiveLink(project.liveLink || "");
            setGithubLink(project.githubLink || "");
            setTechStack(project.techStack?.join(", ") || "");
        } else {
            setIsEditing(false);
            setCurrentProjectId(null);
            setTitle("");
            setDescription("");
            setImage("");
            setLiveLink("");
            setGithubLink("");
            setTechStack("");
        }
        setProjectFile(null);
        setShowModal(true);
    };

    const handleSaveProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("liveLink", liveLink);
            formData.append("githubLink", githubLink);
            formData.append("techStack", techStack);

            if (projectFile) {
                formData.append("image", projectFile);
            } else {
                formData.append("image", image);
            }

            if (isEditing && currentProjectId) {
                await axios.put(`${API_URL}/api/projects/${currentProjectId}`, formData, config);
                toast.success("Project updated successfully");
            } else {
                await axios.post(`${API_URL}/api/projects`, formData, config);
                toast.success("Project added successfully");
            }

            setShowModal(false);
            setProjectFile(null);
            fetchProjects();
        } catch (error) {
            toast.error(isEditing ? "Failed to update project" : "Failed to add project");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            await axios.delete(`${API_URL}/api/projects/${id}`, config);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Manage Projects</h1>
                    <p className="text-gray-400 mt-1.5 text-sm sm:text-base">Add, edit, or delete projects in your portfolio.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-md shadow-primary-500/20"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Project</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : projects.length === 0 ? (
                <div className="glass-card rounded-3xl border border-white/5 p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
                        <FolderPlus className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects found</h3>
                    <p className="text-gray-400 max-w-sm">Your portfolio is currently empty. Add projects to showcase your work.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {projects.map((project: any) => (
                        <div key={project._id} className="glass-card rounded-2xl border border-white/5 overflow-hidden group flex flex-col">
                            <div className="w-full bg-surface-light relative shrink-0 h-36 overflow-hidden">
                                {project.image && (
                                    <img src={project.image.startsWith("http") ? project.image : `${API_URL}${project.image}`} alt={project.title} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute top-2 flex gap-1.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openModal(project)}
                                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-sm text-white mb-1">{project.title}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{project.description}</p>

                                <div className="mt-auto flex flex-wrap gap-1">
                                    {project.techStack?.slice(0, 3).map((tech: string) => (
                                        <span key={tech} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack?.length > 3 && (
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500">
                                            +{project.techStack.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" onClick={() => setShowModal(false)} />
                    <div className="min-h-screen flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                        <div
                            className="glass-card p-8 rounded-2xl w-full max-w-lg border border-white/10 animate-in zoom-in-95 duration-200 relative z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">{isEditing ? "Edit Project" : "Add New Project"}</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleSaveProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack (comma separated)</label>
                                    <input
                                        type="text"
                                        value={techStack}
                                        onChange={(e) => setTechStack(e.target.value)}
                                        placeholder="React, Node.js, Tailwind"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-primary-500/50 cursor-pointer transition-all group overflow-hidden relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setProjectFile(file);
                                                    if (file) setImage(URL.createObjectURL(file));
                                                }}
                                            />
                                            {image ? (
                                                <img src={image.startsWith("http") ? image : (image.startsWith("blob") ? image : `${API_URL}${image}`)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-primary-400">
                                                    <PlusCircle className="w-8 h-8" />
                                                    <span className="text-xs">Click to upload image</span>
                                                </div>
                                            )}
                                        </label>
                                        {image && (
                                            <button
                                                type="button"
                                                onClick={() => { setImage(""); setProjectFile(null); }}
                                                className="text-[10px] text-red-400 mt-1 hover:underline"
                                            >
                                                Remove image
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Or Image URL</label>
                                        <input
                                            type="url"
                                            value={image.startsWith("blob") ? "" : image}
                                            onChange={(e) => { setImage(e.target.value); setProjectFile(null); }}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Live Demo URL</label>
                                        <input
                                            type="url"
                                            value={liveLink}
                                            onChange={(e) => setLiveLink(e.target.value)}
                                            placeholder="https://yourapp.com"
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                        GitHub Repository URL
                                    </label>
                                    <input
                                        type="url"
                                        value={githubLink}
                                        onChange={(e) => setGithubLink(e.target.value)}
                                        placeholder="https://github.com/username/repo"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-gray-600"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-8 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 outline-none rounded-xl text-gray-300 font-medium hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all flex items-center gap-2"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isEditing ? "Update Project" : "Save Project"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
