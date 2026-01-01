import { Music, Zap, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/auth-button';
import Link from 'next/link';

export function HeroSection() {
    return (
        <div className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative container mx-auto px-4 py-20 md:py-32">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Logo/Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-8">
                        <Music className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            TuneTrace 2.0
                        </span>
                    </div>
                    <div className="absolute top-4 right-4 z-50">
                        <AuthButton />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                        Discover Your Next Obsession,
                        <br />
                        One Swipe at a Time
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto">
                        A fresh, interactive way to find your next favorite song. Swipe through AI-powered music recommendations tailored to your vibe.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
                            onClick={() => window.location.href = '/app'}
                        >
                            <Zap className="mr-2 w-5 h-5" />
                            Start Swiping
                        </Button>

                        <Link href="https://github.com/Agrannya-Singh/TuneTrace" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-zinc-700 hover:border-purple-500 bg-transparent hover:bg-purple-500/10 px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
                            >
                                <Github className="mr-2 w-5 h-5" />
                                View on GitHub
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100+</div>
                            <div className="text-zinc-500 text-sm mt-1">Concurrent Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">&lt;200ms</div>
                            <div className="text-zinc-500 text-sm mt-1">DB Latency</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">40%</div>
                            <div className="text-zinc-500 text-sm mt-1">Faster API</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">AI</div>
                            <div className="text-zinc-500 text-sm mt-1">Powered</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
