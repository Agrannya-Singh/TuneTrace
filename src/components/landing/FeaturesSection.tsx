'use client';

import { Cpu, Server, Shield, Youtube, Download, Sparkles } from 'lucide-react';
import { useState } from 'react';

const features = [
    {
        icon: <Cpu className="w-6 h-6" />,
        title: "Microservice Architecture",
        description: "Decoupled services for recommendations, delivering high availability and rapid iteration cycles.",
        colorClass: "text-[hsl(var(--primary))]",
        bgClass: "bg-[hsl(var(--primary))]/10",
        hoverBorder: "hover:border-[hsl(var(--primary))]/40"
    },
    {
        icon: <Server className="w-6 h-6" />,
        title: "Containerized Deployment",
        description: "Standardized Docker environments — \"works on my machine\" translates perfectly to production.",
        colorClass: "text-[hsl(var(--secondary))]",
        bgClass: "bg-[hsl(var(--secondary))]/10",
        hoverBorder: "hover:border-[hsl(var(--secondary))]/40"
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Zero Vendor Lock-in",
        description: "Multi-cloud native design. Move from AWS to Render to Vercel in minutes, not months.",
        colorClass: "text-[hsl(var(--tertiary))]",
        bgClass: "bg-[hsl(var(--tertiary))]/10",
        hoverBorder: "hover:border-[hsl(var(--tertiary))]/40"
    },
    {
        icon: <Youtube className="w-6 h-6" />,
        title: "Low-Latency Previews",
        description: "Edge-optimized video embedding delivering millisecond response times for global audiences.",
        colorClass: "text-[hsl(var(--primary))]",
        bgClass: "bg-[hsl(var(--primary))]/10",
        hoverBorder: "hover:border-[hsl(var(--primary))]/40"
    },
    {
        icon: <Download className="w-6 h-6" />,
        title: "Standardized Data Export",
        description: "Your data remains yours. Export curated playlists in universal JSON and CSV formats.",
        colorClass: "text-[hsl(var(--secondary))]",
        bgClass: "bg-[hsl(var(--secondary))]/10",
        hoverBorder: "hover:border-[hsl(var(--secondary))]/40"
    },
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: "Hybrid Filtering Engine",
        description: "The perfect blend of collaborative and content-based recommendation — no black box.",
        colorClass: "text-[hsl(var(--tertiary))]",
        bgClass: "bg-[hsl(var(--tertiary))]/10",
        hoverBorder: "hover:border-[hsl(var(--tertiary))]/40"
    }
];

export function FeaturesSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="py-32 bg-[hsl(var(--surface))]">
            <div className="max-w-7xl mx-auto px-8">
                <div className="mb-20">
                    <h2 className="text-4xl font-headline font-bold mb-4 tracking-tight text-foreground">
                        Engineering Excellence
                    </h2>
                    <div className="w-20 h-1 bg-[hsl(var(--primary))] rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`glass-card p-8 rounded-xl border border-[hsl(var(--outline-variant))]/10 ${feature.hoverBorder} transition-all duration-300 group`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className={`w-12 h-12 rounded-xl ${feature.bgClass} flex items-center justify-center mb-6 transition-transform duration-300 ${hoveredIndex === index ? 'scale-110' : ''}`}>
                                <span className={feature.colorClass}>{feature.icon}</span>
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-3 text-foreground">{feature.title}</h3>
                            <p className="text-[hsl(var(--on-surface-variant))] leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
