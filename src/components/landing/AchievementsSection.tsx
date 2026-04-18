import { Zap, GitBranch, Brain, Smartphone, CloudCog } from 'lucide-react';

const achievements = [
    {
        icon: <Zap className="w-5 h-5" />,
        text: "Sub-500ms database latency with Redis caching"
    },
    {
        icon: <GitBranch className="w-5 h-5" />,
        text: "Complete CI/CD pipeline on Render"
    },
    {
        icon: <Brain className="w-5 h-5" />,
        text: "Hybrid recommendation engine with Gemini AI"
    },
    {
        icon: <Smartphone className="w-5 h-5" />,
        text: "Mobile-friendly swipe interface"
    },
    {
        icon: <CloudCog className="w-5 h-5" />,
        text: "Cloud agnostic design: tested across AWS, Azure, and Render"
    }
];

export function AchievementsSection() {
    return (
        <section className="py-20 bg-[hsl(var(--surface))]">
            <div className="max-w-5xl mx-auto px-8">
                <div className="glass-card rounded-[2rem] p-12 border border-[hsl(var(--outline-variant))]/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/10 via-transparent to-[hsl(var(--secondary))]/10 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center font-headline text-shimmer">
                            Key Achievements
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {achievements.map((achievement, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-5 bg-[hsl(var(--surface-container))]/80 rounded-xl hover:bg-[hsl(var(--surface-container-high))] transition-colors border border-[hsl(var(--outline-variant))]/10"
                                >
                                    <span className="text-[hsl(var(--primary))] shrink-0">{achievement.icon}</span>
                                    <span className="text-foreground text-sm font-medium leading-relaxed">{achievement.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
