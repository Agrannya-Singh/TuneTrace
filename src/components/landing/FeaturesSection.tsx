import { Sparkles, Youtube, Server, Download, Shield, Cpu } from 'lucide-react';
import { useState } from 'react';

const features = [
    {
        icon: <Cpu className="w-8 h-8" />,
        title: "Microservice Architecture",
        description: "Decoupled specialized services for song recommendations, delivering high availability and easier scaling.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Server className="w-8 h-8" />,
        title: "Containerized Deployment",
        description: "Fully Dockerized application stack ready for orchestration on any cloud provider or bare metal.",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Zero Vendor Lock-in",
        description: "Built with open standards. No proprietary hooks. Move from AWS to Render to Vercel in minutes.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: <Youtube className="w-8 h-8" />,
        title: "Low-Latency Previews",
        description: "Direct client-side video embedding optimized for minimal TTI (Time to Interactive).",
        gradient: "from-red-500 to-orange-500"
    },
    {
        icon: <Download className="w-8 h-8" />,
        title: "Standardized Data Export",
        description: "Export your curated datasets in universal JSON/CSV formats for use in any other system.",
        gradient: "from-indigo-500 to-purple-500"
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Hybrid Filtering Engine",
        description: "A transparent algorithm combining collaborative and content-based filtering without the black box.",
        gradient: "from-pink-500 to-rose-500"
    }
];

export function FeaturesSection() {
    const [isHovered, setIsHovered] = useState<string | null>(null);

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    Engineering First
                </h2>
                <p className="text-muted-foreground text-lg">Built for performance, portability, and transparency.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10"
                        onMouseEnter={() => setIsHovered(feature.title)}
                        onMouseLeave={() => setIsHovered(null)}
                    >
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 text-white transition-transform duration-300 ${isHovered === feature.title ? 'scale-110' : ''}`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
