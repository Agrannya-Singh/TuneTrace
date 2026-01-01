import { Sparkles, Youtube, Heart, Download, TrendingUp, Cpu } from 'lucide-react';
import { useState } from 'react';

const features = [
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Vibe Check",
        description: "Tell us your mood and genre. Get curated tracks that match your vibe perfectly.",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        icon: <Cpu className="w-8 h-8" />,
        title: "AI-Powered Recommendations",
        description: "Our AI learns your taste and suggests new tracks you'll love, keeping discoveries fresh.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Heart className="w-8 h-8" />,
        title: "Swipe to Discover",
        description: "Swipe right to like, left to skip. It's that simple to find your next obsession.",
        gradient: "from-red-500 to-orange-500"
    },
    {
        icon: <Youtube className="w-8 h-8" />,
        title: "Instant Previews",
        description: "Click any card for an instant YouTube preview. Know if it's a hit before you commit.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: <Download className="w-8 h-8" />,
        title: "Personal Mixtape",
        description: "Download your liked songs as a text file, ready for your favorite streaming service.",
        gradient: "from-indigo-500 to-purple-500"
    },
    {
        icon: <TrendingUp className="w-8 h-8" />,
        title: "Hybrid Recommendations",
        description: "Combining collaborative filtering with content-based algorithms for accurate discovery.",
        gradient: "from-pink-500 to-rose-500"
    }
];

export function FeaturesSection() {
    const [isHovered, setIsHovered] = useState<string | null>(null);

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Features That Rock
                </h2>
                <p className="text-zinc-400 text-lg">Everything you need to discover your next favorite song</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                        onMouseEnter={() => setIsHovered(feature.title)}
                        onMouseLeave={() => setIsHovered(null)}
                    >
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 text-white transition-transform duration-300 ${isHovered === feature.title ? 'scale-110' : ''}`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
