'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { Project } from '@/types';
import { PlusCircle, FolderKanban, ArrowRight, Trash2, Calendar, MapPin, Target } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, projects, setProjects, removeProject } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const me = await api.me();
        setUser(me);
        const list = await api.getProjects();
        setProjects(list);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [setUser, setProjects, router]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      removeProject(id);
    } catch (e) {
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-line border-t-cyan rounded-full animate-spin mx-auto" />
        <p className="font-mono text-xs text-paper-dim">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-paper">Startup Workspace</h1>
          <p className="font-mono text-xs text-paper-dim uppercase tracking-wider mt-1">
            Logged in as <span className="text-cyan">{user?.email}</span>
          </p>
        </div>

        <Link
          href="/projects/new"
          className="font-mono text-xs font-semibold bg-cyan text-[#082024] hover:bg-cyan/90 transition-all px-5 py-2.5 rounded flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Startup Idea</span>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-surface border border-line p-12 rounded text-center space-y-4 max-w-lg mx-auto">
          <FolderKanban className="w-12 h-12 text-paper-dim/40 mx-auto" />
          <h3 className="font-serif text-xl text-paper font-medium">No Projects Yet</h3>
          <p className="text-sm text-paper-dim">
            Create your first startup project to generate a full structured blueprint.
          </p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 font-mono text-xs bg-cyan text-[#082024] font-bold px-6 py-2.5 rounded hover:bg-cyan/90 transition-all"
          >
            Create Project →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="group bg-surface border border-line hover:border-cyan/50 p-6 rounded transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-cyan bg-cyan/10 border border-cyan/30 px-2.5 py-0.5 rounded">
                    {p.industry}
                  </span>
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="text-paper-dim/40 hover:text-coral transition-colors p-1"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-serif text-xl text-paper group-hover:text-gold transition-colors font-medium">
                  {p.name}
                </h3>
                <p className="text-xs text-paper-dim line-clamp-2 leading-relaxed">{p.idea}</p>
              </div>

              <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs text-paper-dim font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-gold" /> {p.stage}
                  </span>
                  {p.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-paper-dim" /> {p.country}
                    </span>
                  )}
                </div>
                <span className="group-hover:text-cyan transition-colors flex items-center gap-1 font-semibold">
                  View Blueprint <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
