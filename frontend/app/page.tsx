import Link from 'next/link';
import { Sparkles, Rocket, Compass, Target, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan uppercase tracking-widest bg-cyan/10 border border-cyan/30 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Startup Co-Founder · MVP Engine</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-semibold leading-[1.08] text-paper tracking-tight">
          Turn the idea in your head<br />
          into a <em className="italic text-gold font-serif">startup blueprint</em>.
        </h1>

        <p className="text-base sm:text-lg text-paper-dim leading-relaxed max-w-2xl mx-auto">
          Feed it your idea, budget, and stage. It behaves like an experienced co-founder — validating the problem, sizing the market, sketching the business model, and handing you a 30-day execution plan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/projects/new"
            className="font-mono text-sm font-semibold bg-cyan text-[#082024] hover:bg-cyan/90 transition-all px-8 py-3.5 rounded shadow-lg shadow-cyan/20 flex items-center gap-2"
          >
            <span>Build Your Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="font-mono text-sm border border-line text-paper-dim hover:border-cyan hover:text-cyan transition-all px-6 py-3.5 rounded"
          >
            Sign In to Dashboard
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-line p-6 rounded space-y-3">
          <div className="w-10 h-10 rounded bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-paper font-medium">Market & Competitors</h3>
          <p className="text-sm text-paper-dim leading-relaxed">
            Quantify TAM/SAM/SOM, identify customer personas, and analyze competitor strengths & weaknesses automatically.
          </p>
        </div>

        <div className="bg-surface border border-line p-6 rounded space-y-3">
          <div className="w-10 h-10 rounded bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-paper font-medium">Business Model Canvas</h3>
          <p className="text-sm text-paper-dim leading-relaxed">
            Get structured 9-box BMC layouts, monetization models, cost structures, and unique selling propositions.
          </p>
        </div>

        <div className="bg-surface border border-line p-6 rounded space-y-3">
          <div className="w-10 h-10 rounded bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
            <Rocket className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-paper font-medium">30-Day Execution Plan</h3>
          <p className="text-sm text-paper-dim leading-relaxed">
            Receive prioritized MVP features (Must/Nice/Future), recommended tech stack, launch sequence, and week-by-week actions.
          </p>
        </div>
      </section>

      {/* Proof / Trust Banner */}
      <section className="bg-surface/50 border border-line p-8 rounded text-center space-y-4">
        <h3 className="font-mono text-xs text-gold uppercase tracking-widest">Built for Aspiring Founders</h3>
        <p className="font-serif text-2xl text-paper max-w-xl mx-auto font-medium">
          "Generic AI chats give generic advice. We structure your thoughts like YC or Techstars mentors."
        </p>
        <div className="flex justify-center gap-6 text-xs text-paper-dim font-mono pt-2">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan" /> Strict JSON Validation</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-gold" /> Instant Markdown Export</span>
        </div>
      </section>
    </div>
  );
}
