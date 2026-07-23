'use client';

import React from 'react';
import { StartupBlueprint } from '@/types';
import { Download, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Target, Layers } from 'lucide-react';
import { api } from '@/lib/api';

interface BlueprintResultsProps {
  blueprint: StartupBlueprint;
  analysisId?: string;
  onEditInputs?: () => void;
}

export default function BlueprintResults({ blueprint, analysisId, onEditInputs }: BlueprintResultsProps) {
  const r = blueprint;
  const names = r.startupNames || [];
  const overallScore = r.startupScore?.overall || 75;

  // SVG Dial Math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, overallScore));
  const dashoffset = circumference - (pct / 100) * circumference;

  const handleDownloadMarkdown = () => {
    if (analysisId) {
      window.open(api.downloadReportUrl(analysisId), '_blank');
      return;
    }

    // Client-side fallback download
    const md = `# ${(names[0] || 'Startup Blueprint')}\n\n` +
      `**Elevator pitch:** ${r.elevatorPitch}\n\n` +
      `## Problem\n${r.problem?.statement}\n- **Who:** ${r.problem?.who}\n- **Why it matters:** ${r.problem?.why}\n\n` +
      `## Solution\n${r.solution?.description}\n- **Edge:** ${r.solution?.advantage}\n\n` +
      `## USP\n${r.usp}\n\n` +
      `## Target Customers\n${JSON.stringify(r.targetCustomers, null, 2)}\n\n` +
      `## Market Size\nTAM: ${r.marketSize?.tam} | SAM: ${r.marketSize?.sam} | SOM: ${r.marketSize?.som}\n\n` +
      `## Business Model Canvas\n${Object.entries(r.bmc || {}).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}\n\n` +
      `## Tech Stack\n${Object.entries(r.techStack || {}).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}\n\n` +
      `## Investor Pitch\n${r.investorPitch}\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(names[0] || 'startup-blueprint').toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-fade-in text-paper">
      {/* Header section with Score Dial */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-line">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {names.map((n, i) => (
              <span
                key={n + i}
                className={`font-mono text-xs px-3 py-1 rounded-full border ${
                  i === 0
                    ? 'border-gold text-gold bg-gold/10 font-semibold'
                    : 'border-line text-paper-dim'
                }`}
              >
                {n}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-medium leading-snug text-paper">
            "{r.elevatorPitch}"
          </h1>
        </div>

        {/* Circular Dial SVG */}
        <div className="relative w-32 h-32 flex-shrink-0 self-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r={radius} fill="none" stroke="#2A3A5C" strokeWidth="8" />
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="#E0A458"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-3xl font-bold text-gold leading-none">{overallScore}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-paper-dim mt-1">Startup Score</span>
          </div>
        </div>
      </div>

      {/* Problem & Solution */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Problem & Solution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-line p-5 rounded space-y-3">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">Problem</h3>
            <p className="text-sm text-paper-dim leading-relaxed">{r.problem?.statement}</p>
            <p className="text-xs text-paper"><strong className="text-cyan">Who:</strong> {r.problem?.who}</p>
            <p className="text-xs text-paper"><strong className="text-cyan">Why it matters:</strong> {r.problem?.why}</p>
          </div>
          <div className="bg-surface border border-line p-5 rounded space-y-3">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">Solution</h3>
            <p className="text-sm text-paper-dim leading-relaxed">{r.solution?.description}</p>
            <p className="text-xs text-paper"><strong className="text-cyan">Edge:</strong> {r.solution?.advantage}</p>
          </div>
          <div className="bg-surface border border-line p-5 rounded space-y-3">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">USP</h3>
            <p className="text-sm text-paper-dim leading-relaxed font-medium">{r.usp}</p>
          </div>
        </div>
      </section>

      {/* Target Customer & Market Size */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          <Target className="w-4 h-4" /> Target Customer & Market Size
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-line p-5 rounded space-y-2">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">Customer Profile</h3>
            <p className="text-sm text-paper">{r.targetCustomers?.ageGroup} · {r.targetCustomers?.occupation}</p>
            <p className="text-xs text-paper-dim">{r.targetCustomers?.location} · {r.targetCustomers?.incomeLevel}</p>
          </div>
          <div className="bg-surface border border-line p-5 rounded space-y-2">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">Persona</h3>
            <p className="text-sm text-paper-dim leading-relaxed">{r.targetCustomers?.persona}</p>
          </div>
          <div className="bg-surface border border-line p-5 rounded space-y-2">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">Market Size</h3>
            <p className="text-xs text-paper"><strong className="text-cyan">TAM:</strong> {r.marketSize?.tam}</p>
            <p className="text-xs text-paper"><strong className="text-cyan">SAM:</strong> {r.marketSize?.sam}</p>
            <p className="text-xs text-paper"><strong className="text-cyan">SOM:</strong> {r.marketSize?.som}</p>
          </div>
        </div>
      </section>

      {/* Competitor Landscape */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          Competitor Landscape
        </h2>
        <div className="bg-surface border border-line rounded overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-2 font-mono text-xs uppercase text-paper-dim border-b border-line">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">Strength</th>
                <th className="p-3">Weakness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(r.competitors || []).map((c, i) => (
                <tr key={i} className="hover:bg-ink-2/50 transition-colors">
                  <td className="p-3 font-medium text-paper">{c.name}</td>
                  <td className="p-3 text-paper-dim text-xs">{c.strength}</td>
                  <td className="p-3 text-paper-dim text-xs">{c.weakness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Business Model Canvas Grid */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          <Layers className="w-4 h-4" /> Business Model Canvas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-surface border border-line p-4 rounded md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Value Proposition</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.valueProposition}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Key Partners</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.keyPartners}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Key Activities</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.keyActivities}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Key Resources</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.keyResources}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Relationships</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.customerRelationships}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Channels</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.channels}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Segments</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.customerSegments}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Cost Structure</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.costStructure}</p>
          </div>
          <div className="bg-surface border border-line p-4 rounded md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase text-gold mb-1">Revenue Streams</h4>
            <p className="text-xs text-paper-dim leading-relaxed">{r.bmc?.revenueStreams}</p>
          </div>
        </div>
      </section>

      {/* MVP Features */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          MVP Feature Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-cyan uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Must Have
            </h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.mvpFeatures?.mustHave || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-gold uppercase tracking-wider">Nice to Have</h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.mvpFeatures?.niceToHave || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-paper-dim uppercase tracking-wider">Future Features</h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.mvpFeatures?.future || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          Recommended Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(r.techStack || {}).map(([key, val]) => (
            <div key={key} className="bg-surface border border-line p-3.5 rounded">
              <h3 className="font-mono text-[10px] text-gold uppercase tracking-wider">{key}</h3>
              <p className="text-xs text-paper mt-1 font-medium">{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SWOT Grid */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          SWOT Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border-l-4 border-l-cyan border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-cyan uppercase">Strengths</h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.swot?.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="bg-surface border-l-4 border-l-coral border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-coral uppercase">Weaknesses</h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.swot?.weaknesses || []).map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
          <div className="bg-surface border-l-4 border-l-gold border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-gold uppercase">Opportunities</h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.swot?.opportunities || []).map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div className="bg-surface border-l-4 border-l-paper-dim border border-line p-4 rounded space-y-2">
            <h3 className="font-mono text-xs text-paper-dim uppercase">Threats</h3>
            <ul className="list-disc pl-4 text-xs text-paper-dim space-y-1">
              {(r.swot?.threats || []).map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 30-Day Roadmap */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          Next 30-Day Action Roadmap
        </h2>
        <div className="border-l border-line pl-6 space-y-6">
          {(r.roadmap30day || []).map((w, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-ink border border-cyan flex items-center justify-center font-mono text-[9px] text-cyan">
                {i + 1}
              </div>
              <h3 className="font-mono text-xs font-semibold text-paper">{w.week}</h3>
              <p className="text-xs text-paper-dim mt-1 leading-relaxed">{w.actions}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investor Pitch */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan flex items-center gap-2">
          Investor Pitch Summary
        </h2>
        <div className="bg-ink-2 border-l-4 border-l-gold border border-line p-5 rounded font-serif text-base text-paper leading-relaxed">
          {r.investorPitch}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-6 border-t border-line">
        {onEditInputs && (
          <button
            onClick={onEditInputs}
            className="font-mono text-xs uppercase px-5 py-2.5 rounded border border-line text-paper-dim hover:border-cyan hover:text-cyan transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Inputs
          </button>
        )}
        <button
          onClick={handleDownloadMarkdown}
          className="font-mono text-xs uppercase font-semibold px-6 py-2.5 rounded bg-cyan text-[#082024] hover:bg-cyan/90 transition-all flex items-center gap-2 shadow-lg shadow-cyan/20"
        >
          <Download className="w-3.5 h-3.5" /> Download Blueprint (.md)
        </button>
      </div>
    </div>
  );
}
