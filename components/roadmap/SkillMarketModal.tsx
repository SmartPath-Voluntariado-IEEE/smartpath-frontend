"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, TrendingUp, Target, BookOpen, Briefcase, Clock, Award, CheckCircle2 } from "lucide-react";
import { getSkillIcon } from "@/lib/skill-icon-map";
import { getSkillReason } from "@/lib/skill-reasons";
import type { RoadmapSkill } from "@/types/roadmap";
import type { CourseProgressSummary } from "@/services/api";

interface SkillMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: RoadmapSkill | null;
  isCore: boolean;
  targetRoleLabel: string;
  activeCourse?: CourseProgressSummary | null;
}

export function SkillMarketModal({
  isOpen,
  onClose,
  skill,
  isCore,
  targetRoleLabel,
  activeCourse,
}: SkillMarketModalProps) {
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

  const marketPercent = Math.round((skill.marketFreq || 0) * 100);
  const specificReason = getSkillReason(skill.skill_slug, targetRoleLabel, isCore);

  const getDemandInsight = (percent: number) => {
    if (percent >= 70) {
      return "Filtro prioritario: Presente en más del 70% de las vacantes. Dominarla es prácticamente indispensable para superar el primer filtro técnico de los reclutadores.";
    }
    if (percent >= 40) {
      return "Alta presencia en el mercado: Una herramienta estándar en la industria tech peruana, solicitada regularmente en pruebas y entrevistas de postulación.";
    }
    return "Ventaja competitiva: Aunque no todas las ofertas la exigen de entrada, conocerla te posiciona un paso adelante y te abre puertas en proyectos especializados.";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-market-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border-light bg-white shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Información de la Habilidad
            </span>
            <span className="text-xs text-text-secondary">Mercado & Cursos</span>
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

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border-light bg-surface-dim shadow-xs">
              {getSkillIcon(skill.skill_slug, 34)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 id="skill-market-modal-title" className="font-display text-xl font-bold text-text-primary">
                {skill.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {isCore ? (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    Habilidad Troncal (Core)
                  </span>
                ) : (
                  <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-xs font-semibold text-text-secondary">
                    Diferenciador (Plus)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-variant/40 p-3">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <span className="block text-[10px] uppercase font-semibold text-text-secondary">Tiempo sugerido</span>
                <span className="font-display text-xs font-bold text-text-primary">~{skill.estHours}h de práctica</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-variant/40 p-3">
              <BookOpen className="h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <span className="block text-[10px] uppercase font-semibold text-text-secondary">Catálogo disponible</span>
                <span className="font-display text-xs font-bold text-text-primary">{skill.freeCourseCount} gratis · {skill.courseCount} total</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Presencia en ofertas tech analizadas en Perú</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-primary">
                {marketPercent}%
              </span>
              <span className="text-xs text-text-secondary">
                de las convocatorias para este campo la solicitan en sus requisitos.
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              {getDemandInsight(marketPercent)}
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text-secondary">
              Tu ventaja al postular como {targetRoleLabel}
            </h4>

            <div className="flex items-start gap-3 rounded-xl border border-border-light bg-surface-variant/40 p-3.5">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-xs leading-relaxed text-text-secondary">
                <strong className="block font-medium text-text-primary mb-1">
                  {isCore ? "¿Por qué te la van a pedir en las ofertas?" : "¿Qué valor extra te aporta en las ofertas?"}
                </strong>
                <p className="font-semibold text-text-primary mb-1 text-[13px] leading-snug">
                  {specificReason}
                </p>
                <p className="text-xs text-text-secondary">
                  {isCore
                    ? `Para desempeñarte como ${targetRoleLabel}, las empresas evalúan ${skill.name} en sus filtros técnicos para validar que puedes resolver tareas reales del día a día.`
                    : `Tener ${skill.name} en tu portafolio y CV te abre puertas en vacantes con requerimientos complementarios y te da ventaja frente a otros postulantes.`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border-light bg-surface-variant/40 p-3.5">
              <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="text-xs leading-relaxed text-text-secondary">
                <strong className="block font-medium text-text-primary mb-0.5">
                  Lo que demuestras al dominarla
                </strong>
                Evidencias que sabes trabajar con el stack que actualmente utilizan los equipos de ingeniería, reduciendo el tiempo de capacitación que la empresa necesitaría invertir en ti.
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border-light bg-white p-4 shadow-2xs">
              <h5 className="font-display text-xs font-bold uppercase tracking-wider text-text-secondary mb-2.5 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                Tu curso en el roadmap y validación
              </h5>

              {activeCourse && activeCourse.course_id ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <span className="block text-[11px] font-semibold text-primary">Curso agregado a tu ruta:</span>
                    <p className="font-display text-sm font-bold text-text-primary truncate mt-0.5">
                      {activeCourse.course_title || `Curso #${activeCourse.course_id}`}
                    </p>
                    {activeCourse.progress && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
                          <span>Módulos completados</span>
                          <span className="font-bold text-primary">
                            {activeCourse.progress.completed} de {activeCourse.progress.total} ({activeCourse.progress.percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-light">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${activeCourse.progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Link
                      href={`/courses/${activeCourse.course_id}/modules`}
                      onClick={onClose}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90 text-center"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ir a módulos y tomar prueba
                    </Link>
                    <Link
                      href={`/cursos?skill=${skill.skill_slug}`}
                      onClick={onClose}
                      className="inline-flex items-center justify-center rounded-xl border border-border-light bg-surface-variant px-3 py-2 text-xs font-semibold text-text-secondary transition hover:bg-surface-dim hover:text-text-primary text-center"
                    >
                      Cambiar curso
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border-light bg-surface-variant/30 p-3.5 text-center">
                  <p className="text-xs font-semibold text-text-primary">
                    Aún no has agregado un curso para esta habilidad
                  </p>
                  <p className="mt-1 text-[11px] text-text-secondary">
                    Selecciona un curso para habilitar los módulos de aprendizaje y validar tus conocimientos mediante pruebas interactivas.
                  </p>
                  <Link
                    href={`/cursos?skill=${skill.skill_slug}`}
                    onClick={onClose}
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-primary/90"
                  >
                    Elegir curso en catálogo →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border-light bg-surface-variant/30 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border-light bg-white px-4 py-2 text-xs font-semibold text-text-secondary transition hover:bg-surface-variant hover:text-text-primary"
          >
            Cerrar
          </button>
          {activeCourse && activeCourse.course_id ? (
            <Link
              href={`/courses/${activeCourse.course_id}/modules`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary/90"
              onClick={onClose}
            >
              Tomar prueba de validación →
            </Link>
          ) : (
            <Link
              href={`/cursos?skill=${skill.skill_slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary/90"
              onClick={onClose}
            >
              Explorar cursos de {skill.name} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
