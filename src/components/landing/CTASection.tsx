import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
    return (
        <section className="py-24 px-8">
            <div className="max-w-5xl mx-auto relative glass-card rounded-[2.5rem] p-12 md:p-24 overflow-hidden text-center border border-[hsl(var(--outline-variant))]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/10 via-transparent to-[hsl(var(--secondary))]/10 pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-headline font-extrabold mb-6 tracking-tight text-foreground">
                        Ready to Discover?
                    </h2>
                    <p className="text-xl text-[hsl(var(--on-surface-variant))] mb-12 max-w-2xl mx-auto">
                        Start swiping and find your next favorite song. Built for music lovers, by music lovers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-[hsl(var(--primary))] text-[hsl(var(--on-primary))] px-12 py-6 rounded-full font-headline font-bold text-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(221,184,255,0.4)] transition-all duration-300"
                            onClick={() => window.location.href = '/app'}
                        >
                            Get Started Now
                        </Button>
                        <Link href="https://github.com/Agrannya-Singh/TuneTrace" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-[hsl(var(--outline-variant))]/30 hover:border-[hsl(var(--primary))]/50 bg-transparent hover:bg-[hsl(var(--primary))]/10 px-10 py-6 text-lg rounded-full transition-all hover:scale-105"
                            >
                                <Github className="mr-2 w-5 h-5" />
                                Star on GitHub
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-8 text-sm text-[hsl(var(--on-surface-variant))]/60 font-label tracking-[0.02em]">
                        Open source forever. No credit card required.
                    </p>
                </div>
            </div>
        </section>
    );
}
