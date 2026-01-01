import { Music, Zap, Github, Server, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/auth-button';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

export function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-purple-900/40"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:bg-pink-900/40"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 dark:bg-cyan-900/40"></div>
            </div>

            <div className="relative container mx-auto px-4 py-20 md:py-32">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Logo/Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-8 backdrop-blur-sm">
                        <Server className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-foreground">
                            v2.0 • Cloud Agnostic • Open Source
                        </span>
                    </div>

                    <div className="absolute top-4 right-4 z-50 flex gap-2 items-center">
                        <ModeToggle />
                        <AuthButton />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight leading-tight">
                        Music Discovery.
                        <br />
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                            Deployed Anywhere.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                        Runs on Render. Deploys to Vercel. Scales on Firebase.
                        <br className="hidden md:block" />
                        Experience zero-latency swiping with no vendor lock-in.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105"
                            onClick={() => window.location.href = '/app'}
                        >
                            <Zap className="mr-2 w-5 h-5" />
                            Start Swiping
                        </Button>

                        <Link href="https://github.com/Agrannya-Singh/TuneTrace" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
                            >
                                <Github className="mr-2 w-5 h-5" />
                                Clone Repo
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">Multi</div>
                            <div className="text-muted-foreground text-sm mt-1">Cloud Support</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">&lt;100ms</div>
                            <div className="text-muted-foreground text-sm mt-1">Global Latency</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">Docker</div>
                            <div className="text-muted-foreground text-sm mt-1">Ready</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-foreground">100%</div>
                            <div className="text-muted-foreground text-sm mt-1">Open Source</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
