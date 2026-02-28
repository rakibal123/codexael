"use client";

import { motion } from "framer-motion";
import { Download, Briefcase, GraduationCap, MapPin, Mail, Calendar, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
    const experiences = [
        {
            role: "Enterprise Solutions & Microservices",
            company: "Global Scale Architectures",
            date: "2023 - Present",
            description: "Architecting and engineering scalable enterprise-level microservices utilizing Node.js and Next.js. Improving core application load speeds by up to 45% via server-side rendering and aggressive CDN caching for our enterprise clients."
        },
        {
            role: "E-Commerce & Digital Flagships",
            company: "High-Volume Platforms",
            date: "2021 - 2023",
            description: "Spearheading UI/UX overhauls for flagship e-commerce platforms handling $5M+ in monthly GMV. Building atomic component libraries using React and Tailwind CSS."
        },
        {
            role: "Web Applications & Layouts",
            company: "Foundation Years",
            date: "2019 - 2021",
            description: "Developing and maintaining dozens of production websites using full-stack frameworks. Collaborating closely with creative brands to ensure pixel-perfect implementations."
        }
    ];

    const education = [
        {
            degree: "Certified Cloud Architects",
            institution: "AWS / Google Cloud Partner",
            date: "2022 - Ongoing",
        },
        {
            degree: "Full Stack Engineering Excellence",
            institution: "Continuous Team Learning",
            date: "2019 - Present",
        }
    ];

    return (
        <>
            <Navbar />
            <div className="pt-32 pb-20 min-h-screen">
                <div className="container mx-auto px-6 md:px-12">

                    {/* Hero Section: Profile & Bio */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-5"
                        >
                            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden glass-card border border-white/5 p-4">
                                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                                    {/* Placeholder Profile Photo - Easily swapped by replacing the src */}
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                        alt="Codexael Team"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />

                                    <div className="absolute bottom-6 left-6 z-20 space-y-2">
                                        <div className="flex items-center gap-2 text-white">
                                            <MapPin className="w-4 h-4 text-primary-400" />
                                            <span className="text-sm font-medium">North Kafrul, Dhaka-1216</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white">
                                            <Phone className="w-4 h-4 text-primary-400" />
                                            <span className="text-sm font-medium">0 1531 386247</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white">
                                            <Mail className="w-4 h-4 text-primary-400" />
                                            <span className="text-sm font-medium">codexael@gmail.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-7 flex flex-col justify-center"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Welcome to <span className="text-primary-400">Codexael</span>
                            </h1>
                            <h2 className="text-2xl text-white mb-6 font-medium">
                                Full Stack Engineering & Digital Architecture Agency
                            </h2>

                            <div className="space-y-6 text-lg text-gray-400 leading-relaxed mb-10">
                                <p>
                                    We are a team of engineering professionals focused on delivering robust, ultra-modern web applications. With a deep passion for seamless user experiences and scalable server-side architectures, we merge technical precision with aesthetic perfection.
                                </p>
                                <p>
                                    Our journey started with building simple static HTML layouts and has evolved into orchestrating complex, containerized full-stack deployments. We prioritize clean code, highly reactive layouts, and building platforms that users genuinely love to interact with.
                                </p>
                                <p>
                                    When we're not plunging into deep code, you can find us exploring new tech paradigms, contributing to open-source, or refining UI/UX design languages.
                                </p>
                            </div>

                            <div>
                                <a
                                    href="/codexael-company-profile.pdf"
                                    download
                                    className="inline-flex items-center px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] cursor-pointer"
                                >
                                    <Download className="w-5 h-5 mr-3" />
                                    Download Company Profile
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Journey & Experience Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Experience Timeline */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold">Work Experience</h3>
                            </div>

                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                                {experiences.map((exp, index) => (
                                    <div key={index} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group select-none">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-primary-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow sm:absolute sm:left-1/2 sm:-translate-x-1/2"></div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-2xl border border-white/5 group-hover:border-primary-500/30 transition-colors">
                                            <div className="flex flex-col mb-3 text-sm text-gray-500 gap-2">
                                                <span className="font-bold text-white text-lg">{exp.role}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-primary-400 font-medium">{exp.company}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.date}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Education Timeline */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold">Education Journey</h3>
                            </div>

                            <div className="space-y-6">
                                {education.map((edu, index) => (
                                    <div key={index} className="glass-card p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-6 items-start hover:bg-white/[0.02] transition-colors">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-surface-light text-primary-400 text-sm font-bold">
                                            {edu.date.split(" - ")[1]}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2">{edu.degree}</h4>
                                            <p className="text-primary-400 font-medium mb-2">{edu.institution}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> {edu.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}
