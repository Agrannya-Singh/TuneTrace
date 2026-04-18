import { Code, Database, Cloud } from 'lucide-react';

const techStack = {
    frontend: [
        { name: "Next.js", desc: "React Framework" },
        { name: "TypeScript", desc: "Type Safety" },
        { name: "Tailwind CSS", desc: "Utility Styling" },
        { name: "ShadCN UI", desc: "Component Library" }
    ],
    backend: [
        { name: "FastAPI", desc: "Python API Framework" },
        { name: "SQLAlchemy", desc: "Database ORM" },
        { name: "Redis", desc: "Caching Layer" },
        { name: "YouTube API", desc: "Music Data Source" }
    ],
    infra: [
        { name: "Render", desc: "Microservice Hosting" },
        { name: "Vercel", desc: "Frontend Edge Network" },
        { name: "Firebase", desc: "Auth & Realtime DB" }
    ]
};

export function TechStackSection() {
    return (
        <section className="py-32 bg-[hsl(var(--surface-container-low))]">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4 text-foreground">
                        Built with Modern Standards
                    </h2>
                    <p className="text-[hsl(var(--on-surface-variant))] max-w-2xl mx-auto">
                        A battle-tested foundation designed for performance, portability, and transparency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Frontend */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Code className="w-5 h-5 text-[hsl(var(--primary))]" />
                            <h4 className="text-lg font-headline font-bold tracking-wide uppercase text-foreground">Frontend</h4>
                        </div>
                        <ul className="space-y-4">
                            {techStack.frontend.map((tech, index) => (
                                <li key={index} className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--surface-container-high))]/50 hover:bg-[hsl(var(--surface-container-high))] transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]"></span>
                                    <div>
                                        <span className="font-medium text-foreground">{tech.name}</span>
                                        <span className="text-[hsl(var(--on-surface-variant))] text-sm ml-2">— {tech.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Backend */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Database className="w-5 h-5 text-[hsl(var(--secondary))]" />
                            <h4 className="text-lg font-headline font-bold tracking-wide uppercase text-foreground">Backend & Services</h4>
                        </div>
                        <ul className="space-y-4">
                            {techStack.backend.map((tech, index) => (
                                <li key={index} className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--surface-container-high))]/50 hover:bg-[hsl(var(--surface-container-high))] transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--secondary))]"></span>
                                    <div>
                                        <span className="font-medium text-foreground">{tech.name}</span>
                                        <span className="text-[hsl(var(--on-surface-variant))] text-sm ml-2">— {tech.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Infrastructure */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Cloud className="w-5 h-5 text-[hsl(var(--tertiary))]" />
                            <h4 className="text-lg font-headline font-bold tracking-wide uppercase text-foreground">Cloud Infrastructure</h4>
                        </div>
                        <ul className="space-y-4">
                            {techStack.infra.map((tech, index) => (
                                <li key={index} className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--surface-container-high))]/50 hover:bg-[hsl(var(--surface-container-high))] transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--tertiary))]"></span>
                                    <div>
                                        <span className="font-medium text-foreground">{tech.name}</span>
                                        <span className="text-[hsl(var(--on-surface-variant))] text-sm ml-2">— {tech.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
