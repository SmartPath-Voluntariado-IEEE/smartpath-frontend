"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ExternalLink, BookOpen, Clock, Award, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import { getSkillIcon } from "@/lib/skill-icon-map";
import type { RoadmapSkill } from "@/types/roadmap";
import type { AssignedCourseItem } from "@/services/api";

interface SkillAssignedCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: RoadmapSkill | null;
  courses: AssignedCourseItem[];
}

export function SkillAssignedCoursesModal({
  isOpen,
  onClose,
  skill,
  courses,
}: SkillAssignedCoursesModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !skill) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assigned-courses-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border-light bg-white shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Cursos Asignados
            </span>
            <span className="text-xs text-text-secondary">
              {courses.length} {courses.length === 1 ? "curso vinculado" : "cursos vinculados"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-light text-text-secondary transition hover:bg-surface-variant hover:text-text-primary"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-start gap-3.5 pb-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border-light bg-surface-dim shadow-xs">
              {getSkillIcon(skill.skill_slug, 28)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="assigned-courses-modal-title" className="font-display text-lg font-bold text-text-primary">
                Cursos para {skill.name}
              </h3>
              <p className="text-xs text-text-secondary">
                Gestiona y avanza en los cursos que tienes agregados para dominar esta habilidad.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const isCompleted = course.is_completed || course.percentage === 100;
              return (
                <div
                  key={course.course_id}
                  className={`rounded-2xl border p-4.5 transition-all ${
                    isCompleted
                      ? "border-emerald-200/80 bg-emerald-50/20"
                      : "border-border-light bg-white hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                          {course.platform || "Online"}
                        </span>
                        {course.level && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            {course.level}
                          </span>
                        )}
                        {course.duration_hours && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary font-medium">
                            <Clock className="w-3 h-3 text-text-secondary/80" /> {course.duration_hours}h
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completado
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-sm font-bold text-text-primary leading-snug">
                        <Link
                          href={`/courses/${course.course_id}/modules`}
                          onClick={onClose}
                          className="hover:text-primary hover:underline transition"
                        >
                          {course.course_title}
                        </Link>
                      </h4>
                    </div>

                    {course.course_url && (
                      <a
                        href={course.course_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-light text-text-secondary hover:text-primary hover:bg-surface-variant shrink-0 transition"
                        title="Visitar plataforma del curso"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-border-light/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-text-secondary text-[11px]">
                        {course.total_modules > 0
                          ? `${course.completed_modules} de ${course.total_modules} módulos completados`
                          : "Módulos de evaluación disponibles"}
                      </span>
                      <span className={`text-[11px] font-bold ${isCompleted ? "text-emerald-600" : "text-primary"}`}>
                        {course.percentage}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-emerald-500" : "bg-primary"
                        }`}
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Link
                        href={`/courses/${course.course_id}/modules`}
                        onClick={onClose}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition ${
                          isCompleted
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-primary text-white hover:bg-primary/90"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <span>Repasar módulo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Continuar & pruebas</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href={`/cursos?skill=${skill.skill_slug}`}
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/40 py-2.5 text-xs font-semibold text-primary hover:bg-primary/5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Vincular otro curso para {skill.name} desde el catálogo</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-border-light bg-surface-dim/40 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-variant hover:text-text-primary transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
