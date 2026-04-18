import { Music, Github } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-[hsl(var(--surface-container-low))] w-full py-12 border-t border-foreground/10">
            <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 max-w-7xl mx-auto">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Music className="w-5 h-5 text-[hsl(var(--primary))]" />
                        <span className="text-lg font-bold text-foreground font-headline">TuneTrace</span>
                    </div>
                    <p className="font-label tracking-[0.02em] text-sm text-foreground/40">
                        © 2026 TuneTrace. Crafted with 🎵 for music lovers.
                    </p>
                </div>
                <div className="flex gap-8">
                    <Link
                        href="https://github.com/Agrannya-Singh/TuneTrace"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label tracking-[0.02em] text-sm text-foreground/40 hover:text-foreground hover:translate-y-[-2px] transition-all inline-flex items-center gap-2"
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </Link>
                    <a className="font-label tracking-[0.02em] text-sm text-foreground/40 hover:text-foreground hover:translate-y-[-2px] transition-all" href="#">
                        Architecture
                    </a>
                    <a className="font-label tracking-[0.02em] text-sm text-foreground/40 hover:text-foreground hover:translate-y-[-2px] transition-all" href="#">
                        Docs
                    </a>
                </div>
            </div>
        </footer>
    );
}
