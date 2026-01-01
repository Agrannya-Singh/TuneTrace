import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Ready to Discover?
                </h2>
                <p className="text-xl text-zinc-300 mb-8">
                    Start swiping and find your next favorite song today
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg rounded-full shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
                        onClick={() => window.location.href = '/app'}
                    >
                        Get Started Now
                    </Button>
                    <Link href="https://github.com/Agrannya-Singh/TuneTrace" target="_blank" rel="noopener noreferrer">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-zinc-700 hover:border-purple-500 bg-transparent hover:bg-purple-500/10 px-10 py-6 text-lg rounded-full transition-all hover:scale-105"
                        >
                            <Github className="mr-2 w-5 h-5" />
                            Star on GitHub
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
