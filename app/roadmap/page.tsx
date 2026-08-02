"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getGapAnalysis, getRoadmap, getCatalogRoles, getCatalogCourses } from "@/services/api";

export default function RoadmapPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated } = useProfile();
  
  const [loadingData, setLoadingData] = useState(true);
  const [gap, setGap] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [gapData, roadmapData, rolesData, coursesData] = await Promise.all([
          getGapAnalysis(session.access_token),
          getRoadmap(session.access_token),
          getCatalogRoles(),
          getCatalogCourses()
        ]);
        setGap(gapData);
        setRoadmap(roadmapData);
        setRoles(rolesData);
        setCourses(coursesData);
      } catch (err) {
        console.error("Error al cargar datos del roadmap:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [session]);

  const loading = !hydrated || authLoading || loadingData;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-on-surface">Crea tu perfil primero</h1>
        <Link href="/login" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/80">
          Empezar
        </Link>
      </div>
    );
  }

  const target = roles.find((r) => r.id === profile.targetRoleId) ?? roles[0];
  if (!gap || !roadmap || !target) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-on-surface-variant">Cargando análisis de perfil...</p>
      </div>
    );
  }

  const totalHours = roadmap.reduce((a: number, l: any) => a + l.skills.reduce((x: number, s: any) => x + s.estHours, 0), 0);
  const weeklyHours = profile.availabilityHours || 10;
  const targetMonths = profile.targetMonths || 6;
  const estimatedWeeks = Math.ceil(totalHours / weeklyHours);
  const estimatedMonths = Math.max(1, Math.ceil(estimatedWeeks / 4.33));

  const coursesForSkill = (skillSlug: string) => {
    return courses.filter((c) => c.skill_slugs.includes(skillSlug));
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-sm text-on-surface-variant">Tu ruta personalizada</p>
        <h1 className="font-display text-3xl font-bold text-on-surface">Roadmap para <span className="gradient-text">{target.label}</span></h1>
        <p className="mt-2 text-on-surface-variant">
          {roadmap.length} niveles · ~{totalHours}h estimadas · basado en {gap.missing.length + gap.partial.length} skills por reforzar.
        </p>

        {/* Ritmo y plazo objetivo sincronizados con perfil del backend (HU2 y HU3) */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 font-medium">
            ⏱️ Ritmo: {weeklyHours}h / semana
          </Badge>
          <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50 font-medium">
            🎯 Meta objetivo: {targetMonths} meses (Tiempo est: ~{estimatedMonths} meses)
          </Badge>
        </div>
      </header>

      {roadmap.length === 0 ? (
        <div className="surface-card p-8 text-center bg-white">
          <h2 className="font-display text-xl font-bold text-on-surface">¡Ya dominas todo lo necesario! 🎉</h2>
          <p className="mt-2 text-on-surface-variant">Considera explorar habilidades avanzadas o roles distintos.</p>
        </div>
      ) : (
        <div className="relative space-y-6">
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary via-accent to-transparent md:left-8" aria-hidden />
          {roadmap.map((lvl: any) => (
            <div key={lvl.level} className="relative pl-16 md:pl-20">
              <div className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full gradient-brand text-white shadow-glow md:h-16 md:w-16">
                <span className="font-display text-lg font-bold md:text-2xl">{lvl.level}</span>
              </div>
              <div className="surface-card p-6 bg-white">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-bold text-on-surface">{lvl.label}</h2>
                  <span className="text-xs text-on-surface-variant">
                    {lvl.skills.reduce((a: number, s: any) => a + s.estHours, 0)}h · {lvl.skills.length} skills
                  </span>
                </div>
                <div className="space-y-3">
                  {lvl.skills.map((s: any) => {
                    const skillCourses = coursesForSkill(s.skill_slug);
                    return (
                      <div key={s.skill_slug} className="flex flex-wrap items-center gap-3 rounded-lg border border-outline-variant p-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface">{s.name}</span>
                            <Badge variant="secondary" className="text-xs">{Math.round(s.marketFreq * 100)}% demanda</Badge>
                          </div>
                          <div className="mt-0.5 text-xs text-on-surface-variant">
                            ~{s.estHours}h · {skillCourses.length} curso{skillCourses.length !== 1 ? "s" : ""} disponible{skillCourses.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                        <Link href={`/cursos?skill=${s.skill_slug}`} className="inline-flex h-7 items-center justify-center rounded-md border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low px-2.5 text-[0.8rem] font-medium">
                          Ver cursos
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
