import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-surface py-12">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tighter mb-4 inline-block">
                            Code<span className="text-primary-400">xael</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm">
                            Providing premium web development, UI/UX design, and digital solutions for modern businesses.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-primary-400 transition-colors">Home</Link></li>
                            <li><Link href="/projects" className="text-gray-400 hover:text-primary-400 transition-colors">Projects</Link></li>
                            <li><Link href="/skills" className="text-gray-400 hover:text-primary-400 transition-colors">Skills</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all text-gray-400">
                                <Github size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all text-gray-400">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all text-gray-400">
                                <Twitter size={20} />
                            </a>
                        </div>
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin size={18} />
                                <span>North Kafrul, Dhaka-1216</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Phone size={18} />
                                <a href="tel:01531386247" className="hover:text-primary-400 transition-colors">0 1531 386247</a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Mail size={18} />
                                <a href="mailto:codexael@gmail.com" className="hover:text-primary-400 transition-colors">codexael@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm flex flex-col items-center">
                    <p>&copy; {new Date().getFullYear()} Codexael. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
