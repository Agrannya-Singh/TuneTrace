import { Code, Database, Cloud } from 'lucide-react';

const techStack = {
    frontend: [
        { name: "Next.js", desc: "React Framework", color: "text-foreground" },
        { name: "TypeScript", desc: "Type Safety", color: "text-blue-600 dark:text-blue-400" },
        { name: "Tailwind CSS", desc: "Styling", color: "text-cyan-600 dark:text-cyan-400" },
        { name: "ShadCN UI", desc: "Components", color: "text-foreground" }
    ],
    backend: [
        { name: "FastAPI", desc: "Python API", color: "text-green-600 dark:text-green-400" },
        { name: "SQLAlchemy", desc: "ORM", color: "text-red-600 dark:text-red-400" },
        { name: "Redis", desc: "Caching", color: "text-red-600 dark:text-red-400" },
        { name: "YouTube API", desc: "Music Data", color: "text-red-600 dark:text-red-400" }
    ]
};

export function TechStackSection() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    Powerful Tech Stack
                </h2>
                <p className="text-muted-foreground text-lg">Built with modern, cutting-edge technologies</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Frontend */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Code className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-2xl font-bold text-card-foreground">Frontend</h3>
                    </div>
                    <div className="space-y-4">
                        {techStack.frontend.map((tech, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                <div>
                                    <div className={`font-semibold ${tech.color}`}>{tech.name}</div>
                                    <div className="text-sm text-muted-foreground">{tech.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Backend */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                        <h3 className="text-2xl font-bold text-card-foreground">Backend & Services</h3>
                    </div>
                    <div className="space-y-4">
                        {techStack.backend.map((tech, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                <div>
                                    <div className={`font-semibold ${tech.color}`}>{tech.name}</div>
                                    <div className="text-sm text-muted-foreground">{tech.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Infrastructure */}
                <div className="md:col-span-2 bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Cloud className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <h3 className="text-2xl font-bold text-card-foreground">Cloud Infrastructure</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { name: "Render", desc: "Microservice Hosting" },
                            { name: "Vercel", desc: "Frontend Edge Network" },
                            { name: "Firebase", desc: "Auth & Realtime DB" }
                        ].map((tech, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                <div>
                                    <div className="font-semibold text-foreground">{tech.name}</div>
                                    <div className="text-sm text-muted-foreground">{tech.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
