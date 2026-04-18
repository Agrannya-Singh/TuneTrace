import { Zap, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/auth-button';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 velvet-horizon-gradient overflow-hidden">
            {/* Fixed Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--surface))]/70 backdrop-blur-md shadow-[0_40px_60px_-15px_rgba(147,51,234,0.08)]">
                <div className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎵</span>
                        <span className="text-2xl font-bold tracking-tighter text-foreground font-headline">TuneTrace</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a className="text-[hsl(var(--primary))] font-semibold transition-all duration-300 ease-out font-headline text-sm" href="#">Platform</a>
                        <a className="text-foreground/60 hover:text-foreground transition-all duration-300 ease-out font-headline text-sm" href="#">Architecture</a>
                        <a className="text-foreground/60 hover:text-foreground transition-all duration-300 ease-out font-headline text-sm" href="#">Open Source</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <AuthButton />
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center">
                <div className="z-10">
                    {/* Version Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--surface-container-high))] border border-[hsl(var(--outline-variant))]/20 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--tertiary))] animate-pulse"></span>
                        <span className="text-xs font-label tracking-[0.05em] uppercase text-[hsl(var(--on-surface-variant))]">
                            v2.0 • Cloud Agnostic • Open Source
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-[-0.04em] leading-[0.95] mb-8 text-foreground">
                        Music{' '}
                        <span className="text-shimmer">
                            Discovery.
                        </span>
                        <br />
                        Deployed Anywhere.
                    </h1>

                    <p className="text-xl md:text-2xl text-[hsl(var(--on-surface-variant))] font-light leading-relaxed max-w-xl mb-10">
                        Swipe through songs you&apos;ll love.{' '}
                        <span className="text-foreground font-semibold italic">Built by music lovers</span>,
                        powered by a hybrid recommendation engine with zero vendor lock-in.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="px-8 py-6 bg-gradient-to-br from-[hsl(var(--primary-container))] to-[hsl(var(--secondary-container))] rounded-full text-white font-bold text-lg hover:shadow-2xl hover:shadow-[hsl(var(--primary))]/40 transition-all duration-500 hover:scale-105"
                            onClick={() => window.location.href = '/app'}
                        >
                            <Zap className="mr-2 w-5 h-5" />
                            Start Swiping
                        </Button>

                        <Link href="https://github.com/Agrannya-Singh/Tune_Trace_backend" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-6 glass-card border border-[hsl(var(--outline-variant))]/30 rounded-full text-foreground font-semibold text-lg hover:bg-[hsl(var(--surface-container-highest))]/60 transition-all hover:scale-105"
                            >
                                <Github className="mr-2 w-5 h-5" />
                                View Documentation
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl">
                        {[
                            { value: 'Multi', label: 'Cloud Support' },
                            { value: '<100ms', label: 'Global Latency' },
                            { value: 'Docker', label: 'Ready' },
                            { value: '100%', label: 'Open Source' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-bold text-foreground font-headline">{stat.value}</div>
                                <div className="text-[hsl(var(--on-surface-variant))] text-sm mt-1 font-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative hidden lg:block">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-[hsl(var(--primary))]/20 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[hsl(var(--secondary))]/10 rounded-full blur-[100px]"></div>
                    <div className="relative glass-card border border-[hsl(var(--outline-variant))]/10 rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/hero-visualizer.png"
                            alt="TuneTrace music discovery dashboard"
                            className="w-full h-auto opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))] via-transparent to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
