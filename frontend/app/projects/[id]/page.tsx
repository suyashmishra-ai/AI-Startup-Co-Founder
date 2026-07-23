'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Project, Analysis, StartupBlueprint } from '@/types';
import BlueprintResults from '@/components/BlueprintResults';
import { FolderKanban, Sparkles, PlusCircle } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProjectData() {
      if (!id) return;
      try {
        const p = await api.getProject(id);
        setProject(p);
        const list = await api.getProjectAnalyses(id);
        setAnalyses(list);
        if (list.length > 0) {
          setActiveAnalysis(list[0]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
  }, [id]);

  const handleRunNewAnalysis = async () => {
    if (!project) return;
    setAnalyzing(true);
    setError('');

    try {
      const inputs = {
        idea: project.idea,
        industry: project.industry,
        audience: project.audience,
        country: project.country,
        budget: project.budget,
        team: project.team,
        stage: project.stage,
        goal: project.goal,
      };
      const newAnalysis = await api.analyzeProject(project.id, inputs);
      setAnalyses([newAnalysis, ...analyses]);
      setActiveAnalysis(newAnalysis);
    } catch (err: any) {
      setError(err.message || 'Failed to generate blueprint analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-line border-t-cyan rounded-full animate-spin mx-auto" />
        <p className="font-mono text-xs text-paper-dim">Loading project blueprint...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-serif text-2xl text-paper">Project Not Found</h2>
        <p className="text-sm text-paper-dim">{error || 'Could not locate the requested project.'}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="font-mono text-xs bg-cyan text-[#082024] font-bold px-5 py-2.5 rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Project Header Info */}
      <div className="bg-surface border border-line p-6 rounded space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-cyan bg-cyan/10 border border-cyan/30 px-2.5 py-0.5 rounded">
              {project.industry}
            </span>
            <h1 className="font-serif text-3xl font-semibold text-paper mt-2">{project.name}</h1>
          </div>

          <button
            onClick={handleRunNewAnalysis}
            disabled={analyzing}
            className="font-mono text-xs font-semibold bg-cyan text-[#082024] hover:bg-cyan/90 transition-all px-5 py-2.5 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Re-run AI Analysis</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-paper-dim leading-relaxed">{project.idea}</p>

        <div className="flex flex-wrap gap-4 text-xs font-mono text-paper-dim border-t border-line/50 pt-3">
          <span><strong>Stage:</strong> {project.stage}</span>
          <span><strong>Country:</strong> {project.country || 'N/A'}</span>
          <span><strong>Budget:</strong> {project.budget || 'N/A'}</span>
          <span><strong>Team:</strong> {project.team || 'N/A'}</span>
          <span><strong>Goal:</strong> {project.goal}</span>
        </div>
      </div>

      {/* Analysis History Tabs */}
      {analyses.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line">
          <span className="font-mono text-xs text-paper-dim uppercase mr-2">Versions:</span>
          {analyses.map((ana, idx) => (
            <button
              key={ana.id}
              onClick={() => setActiveAnalysis(ana)}
              className={`font-mono text-xs px-3 py-1.5 rounded transition-colors ${
                activeAnalysis?.id === ana.id
                  ? 'bg-cyan/20 border border-cyan text-cyan font-bold'
                  : 'bg-surface border border-line text-paper-dim hover:text-paper'
              }`}
            >
              Analysis #{analyses.length - idx} ({new Date(ana.created_at).toLocaleDateString()})
            </button>
          ))}
        </div>
      )}

      {/* Active Analysis View */}
      {activeAnalysis ? (
        <BlueprintResults
          blueprint={activeAnalysis.blueprint_json as unknown as StartupBlueprint}
          analysisId={activeAnalysis.id}
        />
      ) : (
        <div className="bg-surface border border-line p-10 rounded text-center space-y-4">
          <h3 className="font-serif text-xl text-paper">No Analysis Generated Yet</h3>
          <p className="text-sm text-paper-dim">Click the button above to run the AI Co-Founder analysis on this project.</p>
        </div>
      )}
    </div>
  );
}
