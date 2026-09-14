"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Briefcase, TrendingUp, Info } from "lucide-react";
import { getSkillIcon } from "@/lib/skill-icon-map";
import { getSkillReason } from "@/lib/skill-reasons";
import type { RoadmapLevel, RoadmapSkill, GapAnalysis } from "@/types/roadmap";

interface RoadmapDetailSectionProps {
  roadmap: RoadmapLevel[];
  gap: GapAnalysis;
  targetRoleLabel: string;
  onSelectSkillForMarket: (skill: RoadmapSkill, isCore: boolean) => void;
  skillProgress?: Record<string, { percent: number }>;
}

export function RoadmapDetailSection({
  roadmap,
  gap,
  targetRoleLabel,
  onSelectSkillForMarket,
}: RoadmapDetailSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const coreSlugs = new Set(gap.target_role?.core_skill_slugs || []);

  const allSkillsWithLevel: Array<{ skill: RoadmapSkill; levelNumber: number; levelLabel: string; isCore: boolean }> = [];

  roadmap.forEach((lvl) => {
    lvl.skills.forEach((s) => {
      allSkillsWithLevel.push({
        skill: s,
        levelNumber: lvl.level,
        levelLabel: lvl.label,
        isCore: coreSlugs.has(s.skill_slug),
      });
    });
  });

  const totalSkills = allSkillsWithLevel.length;
  const coreCount = allSkillsWithLevel.filter((item) => item.isCore).length;
  const complementaryCount = totalSkills - coreCount;
  const totalHours = roadmap.reduce((acc, lvl) => acc + (lvl.estHours || 0), 0);

  return (
    <section className="surface-card mb-8 overflow-hidden rounded-2xl border border-border-light bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display mt-2 text-lg font-bold text-text-primary md:text-xl">
            Habilidades clave que buscan las empresas para {targetRoleLabel}
          </h2>
          <p className="mt-1 text-xs text-text-secondary md:text-sm">
            Identifica las competencias más demandadas en el mercado laboral, por qué te las van a pedir y cómo te ayudan a superar los filtros de contratación.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border-light bg-surface-variant px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-surface-dim"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Ocultar guía <ChevronUp className="h-4 w-4 text-text-secondary" />
            </>
          ) : (
            <>
              Ver qué habilidades piden ({totalSkills}) <ChevronDown className="h-4 w-4 text-text-secondary" />
            </>
          )}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border-light bg-surface-variant/40 p-3.5 text-center">
          <span className="block text-[11px] font-medium text-text-secondary">Total en tu ruta</span>
          <span className="font-display mt-1 block text-xl font-bold text-text-primary">{totalSkills}</span>
        </div>
        <div className="rounded-xl border border-border-light bg-surface-variant/40 p-3.5 text-center">
          <span className="block text-[11px] font-medium text-text-secondary">Filtros clave (Core)</span>
          <span className="font-display mt-1 block text-xl font-bold text-primary">{coreCount}</span>
        </div>
        <div className="rounded-xl border border-border-light bg-surface-variant/40 p-3.5 text-center">
          <span className="block text-[11px] font-medium text-text-secondary">Diferenciadores</span>
          <span className="font-display mt-1 block text-xl font-bold text-text-primary">{complementaryCount}</span>
        </div>
        <div className="rounded-xl border border-border-light bg-surface-variant/40 p-3.5 text-center">
          <span className="block text-[11px] font-medium text-text-secondary">Práctica estimada</span>
          <span className="font-display mt-1 block text-xl font-bold text-emerald-600">~{totalHours}h</span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 border-t border-border-light pt-5">
          <div className="divide-y divide-border-light overflow-hidden rounded-xl border border-border-light bg-white">
            <div className="hidden grid-cols-12 bg-surface-variant/60 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-text-secondary md:grid">
              <span className="col-span-4">Habilidad</span>
              <span className="col-span-2">Etapa en Ruta</span>
              <span className="col-span-4">¿Por qué te la piden en las ofertas?</span>
              <span className="col-span-2 text-right">Demanda real</span>
            </div>

            {allSkillsWithLevel.map(({ skill, levelNumber, levelLabel, isCore }) => {
              const marketPercent = Math.round((skill.marketFreq || 0) * 100);
              const contribution = getSkillReason(skill.skill_slug, targetRoleLabel, isCore);

              return (
                <div
                  key={skill.skill_slug}
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-surface-variant/30 md:grid md:grid-cols-12 md:items-center md:gap-2"
                >
                  <div className="flex items-center gap-3 md:col-span-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-light bg-surface-dim">
                      {getSkillIcon(skill.skill_slug, 20)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-semibold text-sm text-text-primary">{skill.name}</h4>
                        {isCore ? (
                          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            Core
                          </span>
                        ) : (
                          <span className="rounded-md bg-surface-variant px-1.5 py-0.5 text-[10px] font-medium text-text-secondary">
                            Plus
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-text-secondary">~{skill.estHours}h de dedicación</span>
                    </div>
                  </div>

                  <div className="text-xs text-text-secondary md:col-span-2">
                    <span className="font-semibold text-text-primary">Nivel {levelNumber}:</span> {levelLabel}
                  </div>

                  <div className="text-xs leading-relaxed text-text-secondary md:col-span-4">
                    <p className="line-clamp-2 md:line-clamp-none">{contribution}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 md:col-span-2 md:justify-end">
                    <div className="flex items-center gap-1 text-xs font-semibold text-primary md:hidden">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" /> {marketPercent}% de ofertas
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectSkillForMarket(skill, isCore)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                      title="Ver por qué te piden esta habilidad en las vacantes"
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span>Ver demanda</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
