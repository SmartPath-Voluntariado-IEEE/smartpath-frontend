"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  getCatalogSkills,
  getCatalogRoles,
  getGapAnalysis,
  getCourseRecommendations,
} from "@/services/api";

function CoursesContent() {
  const searchParams = useSearchParams();
  const skillParam = searchParams.get("skill") ?? undefined;
  
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated } = useProfile();
  
  const [activeSkillId, setActiveSkillId] = useState<string | undefined>(skillParam);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [gap, setGap] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!session) return;
    const loadInitData = async () => {
      try {
        setLoadingData(true);
        const [skillsData, rolesData, gapData] = await Promise.all([
          getCatalogSkills(),
          getCatalogRoles(),
          getGapAnalysis(session.access_token)
        ]);
        setSkills(skillsData);
        setRoles(rolesData);
        setGap(gapData);
      } catch (err) {
        console.error("Error al cargar catálogos de cursos:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadInitData();
  }, [session]);

  const activeSkill = activeSkillId ? skills.find((s) => s.slug === activeSkillId) : undefined;

  const relevantSkillIds = (() => {
    if (!profile || !gap || roles.length === 0) {
      return skills.map((s) => s.slug);
    }
    const role = roles.find((r) => r.id === profile.targetRoleId) ?? roles[0];
    const ids = new Set<string>();
    gap.missing.forEach((m: any) => ids.add(m.skill_slug));
    gap.partial.forEach((m: any) => ids.add(m.skill_slug));
    if (role && role.core_skill_slugs) {
      role.core_skill_slugs.forEach((s: any) => ids.add(s));
    }
    return [...ids];
  })();

  useEffect(() => {
    if (skillParam && skillParam !== activeSkillId) {
      setActiveSkillId(skillParam);
    }
  }, [skillParam]);

  async function generate(skillSlug: string) {
    if (!session) return;
    const s = skills.find((x) => x.slug === skillSlug);
    if (!s) return;
    setActiveSkillId(skillSlug);
    setLoading(true);
    setError(null);
    setCourses([]);
    try {
      const res = await getCourseRecommendations(session.access_token, skillSlug);
      setCourses(res);
      if (res.length === 0) setError("No se encontraron cursos para esta habilidad.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error inesperado";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hydrated && !loadingData && skillParam && courses.length === 0 && !loading && session) {
      generate(skillParam);
    }
  }, [hydrated, loadingData, skillParam, session]);

  if (authLoading || loadingData) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Recomendaciones Personalizadas Backend
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold text-on-surface">
          {activeSkill ? <>Cursos para <span className="gradient-text">{activeSkill.name}</span></> : "Elige una habilidad"}
        </h1>
        <p className="mt-2 text-on-surface-variant">
          {profile
            ? `Personalizados según tu nivel, tu disponibilidad de ${profile.availabilityHours}h/semana y tu estilo de aprendizaje.`
            : "Inicia sesión para obtener recomendaciones personalizadas."}
        </p>
      </header>

      {/* Skill chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {relevantSkillIds.map((sid) => {
          const s = skills.find((x) => x.slug === sid);
          if (!s) return null;
          const active = activeSkillId === sid;
          return (
            <button
              key={sid}
              onClick={() => generate(sid)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active ? "border-primary bg-primary text-white" : "border-outline-variant bg-white text-on-surface hover:border-primary hover:bg-primary/5"
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="surface-card grid place-items-center p-12 text-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 font-medium text-on-surface">Buscando los mejores cursos en nuestro catálogo...</p>
          <p className="mt-1 text-sm text-on-surface-variant">Filtrando por tu nivel, disponibilidad y estilo.</p>
        </div>
      )}

      {!loading && error && (
        <div className="surface-card p-6 text-center bg-white">
          <p className="text-destructive font-medium">{error}</p>
          {activeSkillId && (
            <Button onClick={() => generate(activeSkillId)} className="mt-4 gradient-brand text-white hover:opacity-90">
              Reintentar
            </Button>
          )}
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Cursos priorizados por el backend según learning_preferences (HU1) y disponibilidad (HU2) */}
          {courses.map((c, i) => {
            const matchesPref = profile?.learningPreferences?.some(
              (p) => c.style?.toLowerCase().includes(p.toLowerCase()) || (p === "video" && c.style?.toLowerCase().includes("video"))
            );
            return (
              <div key={i} className="surface-card flex flex-col p-5 bg-white relative">
                <div className="flex items-start justify-between gap-2 text-on-surface">
                  <Badge variant="secondary">{c.platform}</Badge>
                  <span className="text-sm font-semibold text-amber-500">⭐ {c.rating}</span>
                </div>
                {matchesPref && (
                  <div className="mt-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px]">
                      🎯 Coincide con tu formato preferido
                    </Badge>
                  </div>
                )}
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-on-surface">{c.title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant italic">"{c.why}"</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs text-on-surface-variant">
                  <div><div className="font-semibold text-on-surface">{c.hours}h</div>Duración</div>
                  <div><div className="font-semibold text-on-surface">{c.level}</div>Nivel</div>
                  <div><div className="font-semibold text-on-surface">{c.price}</div>Precio</div>
                  <div><div className="font-semibold text-on-surface capitalize">{c.style}</div>Estilo</div>
                </div>
                <Button variant="outline" className="mt-5 w-full border-outline-variant text-on-surface" onClick={() => window.open(c.url, "_blank", "noreferrer,noopener")}>
                  Ver curso
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && courses.length === 0 && !activeSkillId && (
        <div className="surface-card p-10 text-center bg-white">
          <Sparkles className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-3 font-display text-xl font-bold text-on-surface">Elige una habilidad para empezar</h2>
          <p className="mt-2 text-on-surface-variant">
            Te recomendaremos los mejores cursos para tu perfil.
            {!profile && <> <Link href="/login" className="text-primary hover:underline">Inicia sesión</Link> para mejores resultados.</>}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-6xl px-6 py-10 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
