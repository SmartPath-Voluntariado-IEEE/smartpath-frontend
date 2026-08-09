"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SkillCard } from "./SkillCard";
import type { RoadmapLevel, GapAnalysis } from "@/types/roadmap";

interface LevelRowProps {
  level: RoadmapLevel;
  levelIndex: number;
  totalLevels: number;
  isCurrentLevel: boolean;
  gap: GapAnalysis;
  courses: any[];
  defaultExpanded?: boolean;
}

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  "Fundamentos": "Domina los conceptos esenciales para comenzar.",
  "Lenguajes base": "Aprende los lenguajes esenciales del desarrollo.",
  "Manipulación de Datos": "Aprende a trabajar y transformar datos de manera eficiente.",
  "Frameworks & datos": "Aprende a trabajar y transformar datos de manera eficiente.",
  "Análisis y Visualización": "Convierte datos en información valiosa para la toma de decisiones.",
  "Contenedores & prácticas": "Herramientas y metodologías profesionales para trabajo en equipo.",
  "Cloud & especialización": "Tecnologías avanzadas de infraestructura y especialización.",
  "Proyecto Integrador": "Aplica todo lo aprendido en un proyecto real.",
};

const LEVEL_COLORS: Record<number, { nodeBg: string; barBg: string; hex: string }> = {
  1: { nodeBg: "bg-[#6E43FF]", barBg: "bg-[#6E43FF]", hex: "#6E43FF" },
  2: { nodeBg: "bg-[#FF8A00]", barBg: "bg-[#FF8A00]", hex: "#FF8A00" },
  3: { nodeBg: "bg-[#3D5AFE]", barBg: "bg-[#3D5AFE]", hex: "#3D5AFE" },
  4: { nodeBg: "bg-[#00B4DB]", barBg: "bg-[#00B4DB]", hex: "#00B4DB" },
  5: { nodeBg: "bg-[#00C48C]", barBg: "bg-[#00C48C]", hex: "#00C48C" },
};

export function LevelRow({
  level,
  levelIndex,
  totalLevels,
  isCurrentLevel,
  gap,
  courses,
  defaultExpanded = true,
}: LevelRowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const levelColor = LEVEL_COLORS[level.level] || LEVEL_COLORS[1];
  const description = LEVEL_DESCRIPTIONS[level.label] || "Desarrolla las competencias de este nivel.";

  // Calculate skill progress percentages
  const getSkillPercent = (slug: string): number => {
    const isMastered = gap.mastered.some((s) => s.skill_slug === slug);
    if (isMastered) return 100;

    const partialSkill = gap.partial.find((s) => s.skill_slug === slug);
    if (partialSkill && partialSkill.level) {
      return Math.round((partialSkill.level / 5) * 100);
    }

    return 0; // Missing
  };

  // Calculate overall level progress percent
  const totalSkillsCount = level.skills.length;
  const levelProgressSum = level.skills.reduce((acc, s) => acc + getSkillPercent(s.skill_slug), 0);
  const levelProgressPercent = totalSkillsCount > 0 ? Math.round(levelProgressSum / totalSkillsCount) : 0;

  const coursesForSkill = (skillSlug: string) => {
    return courses.filter((c) => c.skill_slugs?.includes(skillSlug));
  };

  return (
    <div className="relative pb-8 last:pb-0">
      {/* Vertical Timeline Dashed Line connecting nodes */}
      {levelIndex < totalLevels - 1 && (
        <div
          className="absolute left-5 top-10 bottom-0 w-0.5 border-l-2 border-dashed border-primary/30 md:left-6"
          aria-hidden
        />
      )}

      <div className="flex items-start gap-4 md:gap-6">
        {/* Timeline Node */}
        <div
          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-base shadow-glow md:h-12 md:w-12 md:text-lg ${levelColor.nodeBg}`}
        >
          {level.level}
        </div>

        {/* Level Card */}
        <div className="surface-card flex-1 p-5 md:p-6 transition-all duration-200">
          {/* Level Header Row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-lg font-bold text-text-primary md:text-xl">
                {level.label}
              </h3>
              {isCurrentLevel && (
                <Badge className="bg-surface-variant text-primary border border-primary/20 font-semibold">
                  Actual
                </Badge>
              )}
            </div>

            {/* Right Meta & Toggle */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="text-xs font-semibold text-text-secondary">
                {totalSkillsCount} {totalSkillsCount === 1 ? "skill" : "skills"}
              </span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border-light text-text-secondary hover:bg-surface-dim hover:text-text-primary transition-colors"
                aria-label={expanded ? "Colapsar nivel" : "Expandir nivel"}
              >
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {/* Subtitle Description */}
          <p className="mt-1 text-xs text-text-secondary md:text-sm">
            {description}
          </p>

          {/* Level Progress Bar */}
          <div className="mt-4 max-w-xs">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-text-secondary gap-2">
              <span>Progreso</span>
              <span className="font-bold text-text-primary">{levelProgressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border-light">
              <div
                className={`h-full rounded-full transition-all duration-500 ${levelColor.barBg}`}
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Skill Cards Grid (Accordion Content) */}
          {expanded && (
            <div className="mt-6 pt-4 border-t border-border-light">
              <div className="flex flex-wrap gap-4 justify-start">
                {level.skills.map((skill) => {
                  const percent = getSkillPercent(skill.skill_slug);
                  const skillCourses = coursesForSkill(skill.skill_slug);
                  return (
                    <SkillCard
                      key={skill.skill_slug}
                      skill={skill}
                      progressPercent={percent}
                      courseCount={skillCourses.length}
                      accentColorHex={levelColor.hex}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
