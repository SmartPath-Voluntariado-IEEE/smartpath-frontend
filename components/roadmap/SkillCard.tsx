"use client";

import React from "react";
import Link from "next/link";
import { SkillProgressRing } from "./SkillProgressRing";
import { getSkillIcon } from "@/lib/skill-icon-map";
import type { RoadmapSkill } from "@/types/roadmap";

interface SkillCardProps {
  skill: RoadmapSkill;
  progressPercent: number;
  courseCount: number;
  /** Posición dentro del nivel: la primera es la de mayor prioridad. */
  rank: number;
  accentColorHex?: string;
}

export function SkillCard({
  skill,
  progressPercent,
  courseCount,
  rank,
  accentColorHex,
}: SkillCardProps) {
  const freeCourses = skill.freeCourseCount ?? 0;
  const hasCourses = courseCount > 0;

  return (
    <div className="surface-card relative flex w-full max-w-[200px] flex-col items-center justify-between p-4 transition-all duration-200 hover:shadow-highlight hover:-translate-y-0.5">
      {/* La habilidad más prioritaria del nivel se marca explícitamente:
          el orden por sí solo no comunica que hay una priorización detrás. */}
      {rank === 0 && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
          Empieza por aquí
        </span>
      )}

      {/* Skill Title */}
      <h4 className="mb-3 mt-1 text-center text-sm font-semibold text-text-primary line-clamp-1">
        {skill.name}
      </h4>

      {/* Progress Ring with Icon */}
      <div className="my-1 flex items-center justify-center">
        <SkillProgressRing percent={progressPercent} ringColorHex={accentColorHex}>
          {getSkillIcon(skill.skill_slug, 32)}
        </SkillProgressRing>
      </div>

      <p className="mt-3 text-center text-[11px] text-text-secondary">
        ~{skill.estHours}h ·{" "}
        {freeCourses > 0
          ? `${freeCourses} ${freeCourses === 1 ? "curso gratis" : "cursos gratis"}`
          : hasCourses
            ? `${courseCount} de pago`
            : "sin cursos aún"}
      </p>

      {/* Action Button */}
      <div className="mt-3 w-full text-center">
        <Link
          href={`/cursos?skill=${skill.skill_slug}`}
          className={`inline-flex w-full items-center justify-center rounded-[10px] px-3 py-1.5 text-xs font-semibold border transition-colors ${
            hasCourses
              ? "bg-white text-primary border-border-light hover:bg-surface-variant"
              : "pointer-events-none border-border-light bg-surface-dim text-text-secondary opacity-60"
          }`}
          aria-disabled={!hasCourses}
        >
          {hasCourses ? "Ver cursos" : "Sin cursos"}
        </Link>
      </div>
    </div>
  );
}
