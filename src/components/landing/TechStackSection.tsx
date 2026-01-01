import { Code, Database } from 'lucide-react';

const techStack = {
    frontend: [
        { name: "Next.js", desc: "React Framework", color: "text-black dark:text-white" },
        { name: "TypeScript", desc: "Type Safety", color: "text-blue-600" },
        { name: "Tailwind CSS", desc: "Styling", color: "text-cyan-500" },
        { name: "ShadCN UI", desc: "Components", color: "text-zinc-900 dark:text-zinc-100" }
    ],
    backend: [
        { name: "FastAPI", desc: "Python API", color: "text-green-600" },
        { name: "SQLAlchemy", desc: "ORM", color: "text-red-600" },
        { name: "Redis", desc: "Caching", color: "text-red-500" },
        { name: "YouTube API", desc: "Music Data", color: "text-red-600" }
    ]
};

export function TechStackSection() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Powerful Tech Stack
                </h2>
                <p className="text-zinc-400 text-lg">Built with modern, cutting-edge technologies</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Frontend */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Code className="w-8 h-8 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white">Frontend</h3>
                    </div>
                    <div className="space-y-4">
                        {techStack.frontend.map((tech, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                <div>
                                    <div className={`font-semibold ${tech.color}`}>{tech.name}</div>
                                    <div className="text-sm text-zinc-500">{tech.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Backend */}
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="w-8 h-8 text-cyan-400" />
                        <h3 className="text-2xl font-bold text-white">Backend & Services</h3>
                    </div>
                    <div className="space-y-4">
                        {techStack.backend.map((tech, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                                <div>
                                    <div className={`font-semibold ${tech.color}`}>{tech.name}</div>
                                    <div className="text-sm text-zinc-500">{tech.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
