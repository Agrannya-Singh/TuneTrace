'use client';

import { Button } from '@/components/ui/button';
import { Github, Music, Sparkles, Zap, Heart, Download, Youtube, TrendingUp, Code, Database, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

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

  const achievements = [
    "🚀 Sub-200ms database latency with Redis caching",
    "⚡ 40% reduction in API response times",
    "👥 Handles 100+ concurrent users",
    "🔄 Complete CI/CD pipeline on Render",
    "🎵 Hybrid recommendation engine",
    "📱 Mobile-friendly swipe interface"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      {/* Hero Section */}
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

      {/* Features Section */}
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

      {/* Tech Stack Section */}
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

      {/* Achievements Section */}
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

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6 text-purple-400" />
              <span className="font-semibold text-lg">TuneTrace</span>
            </div>
            <div className="text-zinc-500 text-sm">
              © 2025 TuneTrace. Built with ❤️ for music lovers
            </div>
            <div className="flex gap-4">
              <Link 
                href="https://github.com/Agrannya-Singh/TuneTrace" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-purple-400 transition-colors"
              >
                <Github className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
