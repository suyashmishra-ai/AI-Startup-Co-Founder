'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BlueprintResults from '@/components/BlueprintResults';
import { StartupBlueprint } from '@/types';
import { Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const LOADING_MESSAGES = [
  "Briefing your co-founder...",
  "Sizing up the market...",
  "Sketching the business model...",
  "Stress-testing the idea...",
  "Drafting the 30-day plan...",
];

export default function NewProjectPage() {
  const router = useRouter();

  // Form State
  const [idea, setIdea] = useState("An AI that creates personalized fitness plans based on a user's schedule, goals, and available equipment.");
  const [industry, setIndustry] = useState('HealthTech');
  const [audience, setAudience] = useState('Busy working professionals, 22–40');
  const [country, setCountry] = useState('India');
  const [budget, setBudget] = useState('200000');
  const [team, setTeam] = useState('2');
  const [stage, setStage] = useState('Idea');
  const [goal, setGoal] = useState('Launch within six months');

  // UI Flow State
  const [viewState, setViewState] = useState<'form' | 'loading' | 'results'>('form');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState('');
  const [generatedBlueprint, setGeneratedBlueprint] = useState<StartupBlueprint | null>(null);
  const [analysisId, setAnalysisId] = useState<string | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();

  // Auth Check & Query Params
  useEffect(() => {
    async function checkAuth() {
      try {
        await api.me();
        const urlIdea = new URLSearchParams(window.location.search).get('idea');
        if (urlIdea) setIdea(urlIdea);
      } catch (e) {
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  // Rotate loading messages
  useEffect(() => {
    if (viewState !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [viewState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea || !industry || !goal) {
      setError('Idea, Industry, and Primary Goal are required.');
      return;
    }

    setError('');
    setViewState('loading');

    try {
      // 1. Create project in DB (or work guest session if unauthenticated)
      const inputs = { idea, industry, audience, country, budget, team, stage, goal };
      const projectName = idea.split(' ').slice(0, 3).join(' ') || 'New Startup';
      
      let createdProject;
      try {
        createdProject = await api.createProject({ name: projectName, ...inputs });
        setProjectId(createdProject.id);
      } catch (authErr) {
        // If not logged in, user will be prompted to login/signup or view result
      }

      const pId = createdProject?.id || 'demo';

      // 2. Trigger AI Blueprint Analysis
      let analysis;
      if (pId !== 'demo') {
        analysis = await api.analyzeProject(pId, inputs);
        setGeneratedBlueprint(analysis.blueprint_json as unknown as StartupBlueprint);
        setAnalysisId(analysis.id);
      } else {
        // Fallback demo flow if client unauthenticated
        setGeneratedBlueprint({
          startupNames: ["FitMind AI", "GymGenie", "HealthPilot"],
          elevatorPitch: "An AI platform creating custom workouts based on schedule and equipment.",
          problem: { statement: "Generic fitness apps ignore daily schedule shifts.", who: "Busy professionals", why: "High dropout rates." },
          solution: { description: "Dynamic AI schedule-aware workout generator.", advantage: "Adapts in real-time." },
          targetCustomers: { ageGroup: "22-40", occupation: "Corporate Employees", location: country, incomeLevel: "Mid-High", persona: "Tech-savvy worker with limited free time." },
          marketSize: { tam: "₹500Cr", sam: "₹80Cr", som: "₹10Cr" },
          competitors: [{ name: "Freeletics", strength: "Large userbase", weakness: "Static plans" }],
          usp: "Real-time AI schedule adaptation.",
          revenueModel: ["Subscription", "Freemium"],
          bmc: {
            keyPartners: "Gyms, Corporate Wellness",
            keyActivities: "AI Model Tuning",
            keyResources: "Workout Ontology",
            valueProposition: "Personalized AI Fitness Coach",
            customerRelationships: "Automated In-App",
            channels: "Instagram, App Stores",
            customerSegments: "Busy Working Adults",
            costStructure: "Hosting, API costs",
            revenueStreams: "Monthly SaaS"
          },
          mvpFeatures: { mustHave: ["Schedule Sync", "Workout Generator"], niceToHave: ["Social sharing"], future: ["Wearable integration"] },
          techStack: { frontend: "Next.js", backend: "FastAPI", database: "PostgreSQL", aiModel: "Claude 3.5 Sonnet", hosting: "Vercel", authentication: "JWT", storage: "PostgreSQL" },
          marketingPlan: ["Instagram Ads", "Product Hunt", "LinkedIn Content"],
          launchStrategy: ["Build MVP", "Collect feedback", "Iterate", "Beta launch", "Public launch"],
          risks: { technical: "LLM latency", financial: "Customer acquisition cost", legal: "Health advice disclaimers", market: "Competition", competition: "Established apps" },
          swot: { strengths: ["Fast iteration"], weaknesses: ["New brand"], opportunities: ["Corporate partnerships"], threats: ["Big tech clones"] },
          roadmap30day: [
            { week: "Week 1", actions: "Build core workout engine" },
            { week: "Week 2", actions: "Integrate LLM prompt & UI" },
            { week: "Week 3", actions: "Beta testing with 50 users" },
            { week: "Week 4", actions: "Public launch" }
          ],
          investorPitch: "FitMind AI is turning static workout plans into adaptive real-time AI coaching for busy professionals.",
          startupScore: { overall: 84, innovation: 88, feasibility: 82, marketPotential: 86, scalability: 85, executionComplexity: 75 }
        });
      }

      setViewState('results');
    } catch (err: any) {
      setViewState('form');
      setError(err.message || 'Something went wrong generating the blueprint. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {viewState === 'form' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="font-mono text-xs text-cyan uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> New Startup Blueprint Wizard
            </div>
            <h1 className="font-serif text-3xl font-semibold text-paper">Brief Your AI Co-Founder</h1>
            <p className="text-sm text-paper-dim">
              Fill in your idea and parameters below. Our AI co-founder will analyze your market, business model, and execution roadmap.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-line p-8 rounded space-y-6 shadow-xl">
            {error && (
              <div className="p-3 bg-coral/10 border border-coral/30 rounded text-coral font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-paper-dim uppercase">Startup Idea *</label>
                <textarea
                  required
                  rows={3}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. An AI that creates personalized fitness plans based on a user's daily schedule and equipment."
                  className="w-full bg-ink-2 border border-line focus:border-cyan text-paper p-3 rounded text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-paper-dim uppercase">Industry *</label>
                  <input
                    type="text"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. HealthTech"
                    className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-paper-dim uppercase">Target Audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Busy working professionals, 22–40"
                    className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-paper-dim uppercase">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-paper-dim uppercase">Budget (₹ or $)</label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 200000"
                    className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-paper-dim uppercase">Team Size</label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-paper-dim uppercase">Current Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                  >
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Launch">Launch</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs text-paper-dim uppercase">Primary Goal *</label>
                <input
                  type="text"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Launch within six months"
                  className="w-full bg-ink-2 border border-line focus:border-cyan text-paper px-3 py-2.5 rounded text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="font-mono text-xs font-semibold bg-cyan text-[#082024] hover:bg-cyan/90 transition-all px-8 py-3.5 rounded shadow-lg shadow-cyan/20 flex items-center gap-2 uppercase"
            >
              <span>Generate Blueprint →</span>
            </button>
          </form>
        </div>
      )}

      {viewState === 'loading' && (
        <div className="py-28 text-center space-y-6">
          <div className="w-12 h-12 border-2 border-line border-t-cyan rounded-full animate-spin mx-auto" />
          <p className="font-mono text-sm text-cyan tracking-wider uppercase animate-pulse">
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
        </div>
      )}

      {viewState === 'results' && generatedBlueprint && (
        <BlueprintResults
          blueprint={generatedBlueprint}
          analysisId={analysisId}
          onEditInputs={() => setViewState('form')}
        />
      )}
    </div>
  );
}
