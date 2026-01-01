import { Music, Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Music className="w-6 h-6 text-purple-400" />
                        <span className="font-semibold text-lg">TuneTrace</span>
                    </div>
                    <div className="text-zinc-500 text-sm">
                        © 2025 TuneTrace. Built with ❤️ for music lovers
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="https://github.com/Agrannya-Singh/TuneTrace"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-purple-400 transition-colors"
                        >
                            <Github className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
