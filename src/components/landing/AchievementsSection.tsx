export function AchievementsSection() {
    const achievements = [
        " Sub-500ms database latency with Redis caching",
        " Complete CI/CD pipeline on Render",
        " Hybrid recommendation engine",
        " Mobile-friendly swipe interface",
        "Cloud Agnostic desgin: testes across AWS, Azure and render"
    ];

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-3xl p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Key Achievements
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-900 transition-colors">
                            <span className="text-lg">{achievement}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
