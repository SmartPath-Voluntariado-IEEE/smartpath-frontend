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
  accentColorHex?: string;
}

export function SkillCard({
  skill,
  progressPercent,
  courseCount,
  accentColorHex,
}: SkillCardProps) {
  return (
    <div className="surface-card flex w-full max-w-[200px] flex-col items-center justify-between p-4 transition-all duration-200 hover:shadow-highlight hover:-translate-y-0.5">
      {/* Skill Title */}
      <h4 className="mb-3 text-center text-sm font-semibold text-text-primary line-clamp-1">
        {skill.name}
      </h4>

      {/* Progress Ring with Icon */}
      <div className="my-1 flex items-center justify-center">
        <SkillProgressRing percent={progressPercent} ringColorHex={accentColorHex}>
          {getSkillIcon(skill.skill_slug, 32)}
        </SkillProgressRing>
      </div>

      {/* Action Button */}
      <div className="mt-4 w-full text-center">
        <Link
          href={`/cursos?skill=${skill.skill_slug}`}
          className="inline-flex w-full items-center justify-center rounded-[10px] bg-white px-3 py-1.5 text-xs font-semibold text-primary border border-border-light hover:bg-surface-variant transition-colors"
        >
          Ver cursos
        </Link>
      </div>
    </div>
  );
}
