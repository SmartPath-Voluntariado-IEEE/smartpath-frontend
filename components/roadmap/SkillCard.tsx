"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, Layers } from "lucide-react";
import { SkillProgressRing } from "./SkillProgressRing";
import { SkillAssignedCoursesModal } from "./SkillAssignedCoursesModal";
import { getSkillIcon } from "@/lib/skill-icon-map";
import type { RoadmapSkill } from "@/types/roadmap";
import type { CourseProgressSummary, AssignedCourseItem } from "@/services/api";

interface SkillCardProps {
  skill: RoadmapSkill;
  progressPercent: number;
  courseCount: number;
  rank: number;
  accentColorHex?: string;
  activeCourse?: CourseProgressSummary | null;
  onOpenMarketModal?: (skill: RoadmapSkill) => void;
}

export function SkillCard({
  skill,
  progressPercent,
  courseCount,
  rank,
  accentColorHex,
  activeCourse,
  onOpenMarketModal,
}: SkillCardProps) {
  const [isAssignedModalOpen, setIsAssignedModalOpen] = useState(false);

  const isMastered = skill.isMastered || progressPercent === 100;
  const effectivePercent = isMastered ? 100 : progressPercent;
  const hasCourses = courseCount > 0;
  const hasActiveCourse = Boolean(activeCourse && activeCourse.course_id);

  const assignedCourses: AssignedCourseItem[] =
    activeCourse?.assigned_courses && activeCourse.assigned_courses.length > 0
      ? activeCourse.assigned_courses
      : hasActiveCourse
        ? [
            {
              course_id: activeCourse!.course_id!,
              course_title: activeCourse!.course_title || "Curso asignado",
              course_url: activeCourse!.course_url,
              completed_modules: activeCourse!.completed_modules || 0,
              total_modules: activeCourse!.total_modules || 0,
              percentage: activeCourse!.course_percentage || 0,
              is_completed: (activeCourse!.course_percentage || 0) === 100,
            },
          ]
        : [];

  const isCourseFullyCompleted =
    isMastered ||
    effectivePercent === 100 ||
    (hasActiveCourse && (activeCourse?.course_percentage || 0) === 100);

  return (
    <>
      <div
        className={`surface-card relative flex w-full flex-col items-center justify-between p-4 transition-all duration-200 hover:shadow-highlight hover:-translate-y-0.5 ${
          isMastered ? "border-emerald-200/80 bg-emerald-50/20" : ""
        }`}
      >
        {isMastered ? (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            ✓ Dominada
          </span>
        ) : rank === 0 ? (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            Empieza por aquí
          </span>
        ) : null}

        {onOpenMarketModal && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenMarketModal(skill);
            }}
            className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-text-secondary/70 transition-colors hover:bg-surface-variant hover:text-primary"
            title="Ver motivo, horas y demanda laboral"
            aria-label={`Consultar información de ${skill.name}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        )}

        <h4 className="mb-3 mt-1 text-center text-sm font-semibold text-text-primary line-clamp-1 pr-4 pl-4">
          {skill.name}
        </h4>

        <div className="my-1 flex items-center justify-center">
          <SkillProgressRing
            percent={effectivePercent}
            ringColorHex={isMastered ? "#10B981" : accentColorHex}
          >
            {getSkillIcon(skill.skill_slug, 32)}
          </SkillProgressRing>
        </div>

        <div className="mt-3 w-full text-center">
          {hasActiveCourse ? (
            <div className="space-y-1">
              <Link
                href={`/courses/${activeCourse?.course_id}/modules`}
                className="block truncate text-[11px] font-semibold text-primary px-1 hover:underline transition"
                title={activeCourse?.course_title || "Curso asignado"}
              >
                {activeCourse?.course_title || "Curso asignado"}
              </Link>
              {assignedCourses.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsAssignedModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary hover:bg-primary/20 transition"
                  title="Ver todos los cursos agregados a esta competencia"
                >
                  <Layers className="w-2.5 h-2.5" />
                  <span>{assignedCourses.length} cursos agregados</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-text-secondary">
              {isMastered ? "Habilidad consolidada" : "Sin curso asignado"}
            </p>
          )}
        </div>

        <div className="mt-2.5 w-full space-y-1.5 text-center">
          {hasActiveCourse ? (
            <div className="space-y-1.5">
              <Link
                href={`/courses/${activeCourse?.course_id}/modules`}
                className={`inline-flex w-full items-center justify-center rounded-[10px] px-3 py-1.5 text-xs font-semibold shadow-2xs transition ${
                  isCourseFullyCompleted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {isCourseFullyCompleted ? "Repasar módulo" : "Continuar & pruebas →"}
              </Link>

              {assignedCourses.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsAssignedModalOpen(true)}
                  className="w-full text-[11px] font-semibold text-primary hover:underline text-center py-0.5"
                >
                  Ver cursos asignados ({assignedCourses.length})
                </button>
              )}
            </div>
          ) : (
            <Link
              href={`/cursos?skill=${skill.skill_slug}`}
              className={`inline-flex w-full items-center justify-center rounded-[10px] px-3 py-1.5 text-xs font-semibold border transition-colors ${
                isMastered
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : hasCourses
                    ? "bg-white text-primary border-border-light hover:bg-surface-variant"
                    : "pointer-events-none border-border-light bg-surface-dim text-text-secondary opacity-60"
              }`}
              aria-disabled={!hasCourses && !isMastered}
            >
              {isMastered
                ? hasCourses
                  ? "Repasar cursos"
                  : "Dominada"
                : hasCourses
                  ? "Elegir curso"
                  : "Sin cursos"}
            </Link>
          )}

          {onOpenMarketModal && (
            <button
              type="button"
              onClick={() => onOpenMarketModal(skill)}
              className="text-[11px] font-medium text-text-secondary transition-colors hover:text-primary hover:underline block w-full"
            >
              ¿Por qué en tu ruta?
            </button>
          )}
        </div>
      </div>

      <SkillAssignedCoursesModal
        isOpen={isAssignedModalOpen}
        onClose={() => setIsAssignedModalOpen(false)}
        skill={skill}
        courses={assignedCourses}
      />
    </>
  );
}
