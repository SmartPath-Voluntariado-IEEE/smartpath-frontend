"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, ArrowRight, CheckCircle2, Building2, Clock, Zap, Sparkles, Compass, HelpCircle } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { useSmartPathTour } from "@/components/tour/SmartPathTourProvider";
import { DashboardAchievementsWidget } from "@/components/achievements/DashboardAchievementsWidget";
import { getSkillIcon } from "@/lib/skill-icon-map";
import {
  getBackendProfile,
  upsertBackendProfile,
  getGapAnalysis,
  getRoadmap,
  getCatalogRoles,
  isOnboardingComplete,
  getDashboardCourseProgress,
  getMarketOverview,
  getUserJobMatches,
} from "@/services/api";
import type { MarketOverview, JobMatch } from "@/services/api";
import { loadProfile, type UserProfile } from "@/lib/profile-store";

const COMPANY_LOGOS: Record<string, string> = {
  bcp: "/img/companies/bcp.png",
  "bcp digital": "/img/companies/bcp.png",
  "banco de crédito": "/img/companies/bcp.png",
  interbank: "/img/companies/interbank.png",
  tiktok: "/img/companies/tiktok.png",
  "ntt data": "/img/companies/ntt-data.png",
  solera: "/img/companies/solera.png",
  "solera holdings": "/img/companies/solera.png",
  "solera holdings, llc.": "/img/companies/solera.png",
  etraveli: "/img/companies/etraveli.png",
  "etraveli group": "/img/companies/etraveli.png",
  encora: "/img/companies/encora.png",
  entel: "/img/companies/entel.png",
  "entel perú": "/img/companies/entel.png",
  claro: "/img/companies/claro.png",
};

function getCompanyLogo(companyName: string | null): string | null {
  if (!companyName) return null;
  const normalized = companyName.toLowerCase().trim();
  for (const [key, logoPath] of Object.entries(COMPANY_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return logoPath;
    }
  }
  return null;
}

function formatSalary(salary: number | null): string {
  if (!salary) return "A convenir";
  return `S/ ${salary.toLocaleString("es-PE")}`;
}

function getSeniorityColor(seniority: string | null): string {
  switch (seniority) {
    case "Practicante": return "bg-blue-100 text-blue-800";
    case "Junior": return "bg-violet-100 text-violet-800";
    case "Semi Senior": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function getCardBorderClass(pct: number): string {
  if (pct >= 70) return "border-emerald-200/90 hover:border-emerald-300 hover:shadow-emerald-500/10";
  if (pct >= 40) return "border-amber-200/90 hover:border-amber-300 hover:shadow-amber-500/10";
  return "border-indigo-200/90 hover:border-indigo-300 hover:shadow-indigo-500/10";
}

const FOCUS_PHRASES = [
  "Un paso pequeño hoy es un gran salto mañana.",
  "La constancia vence al talento cuando el talento no es constante.",
  "No busques la perfección, busca el progreso.",
  "Cada línea de código te acerca a tu meta.",
  "Hoy es un buen día para aprender algo nuevo.",
  "Lo que practicas hoy, lo dominas mañana.",
  "Pequeños hábitos, grandes resultados.",
  "Tu futuro yo te lo va a agradecer.",
];

function pickFocusPhrase(): string {
  return FOCUS_PHRASES[Math.floor(Math.random() * FOCUS_PHRASES.length)];
}

export default function DashboardPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated, save } = useProfile();
  const { startTour } = useSmartPathTour();
  const [loadingData, setLoadingData] = useState(true);
  
  const [gap, setGap] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);

  useEffect(() => {
    if (!session) return;

    const loadAllData = async () => {
      try {
        setLoadingData(true);
        const [rolesData, marketData] = await Promise.all([
          getCatalogRoles().catch(() => []),
          getMarketOverview().catch(() => null),
        ]);
        setRoles(rolesData && rolesData.length > 0 ? rolesData : []);
        if (marketData) setMarketOverview(marketData);

        let profileData = await getBackendProfile(session.access_token).catch(() => null);

        if (!profileData) {
          const local = loadProfile();
          if (local && local.onboardingComplete) {
            try {
              profileData = await upsertBackendProfile(session.access_token, local);
            } catch (syncErr) {
              console.error("Error al auto-sincronizar el perfil local:", syncErr);
            }
          }
        }

        if (!isOnboardingComplete(profileData)) {
          router.push("/onboarding");
          return;
        }

        const mappedProfile: UserProfile = {
          fullName: profileData.full_name || profileData.email?.split("@")[0] || "",
          email: profileData.email || "",
          university: profileData.university || "",
          career: profileData.career || "",
          cycle: profileData.academic_cycle ? String(profileData.academic_cycle) : "9",
          isGraduated: profileData.experience_level === "Egresado",
          availabilityHours: profileData.weekly_hours || 10,
          goal: profileData.professional_goal || "",
          targetMonths: profileData.target_months || 6,
          targetRoleId: profileData.target_role_id || "fullstack",
          interests: profileData.interests || [],
          experience: loadProfile()?.experience ?? [],
          learningPreferences: profileData.learning_preferences || [],
          languages: profileData.english_level ? profileData.english_level.split(", ") : ["Español"],
          certifications: [],
          skills: profileData.skills ? profileData.skills.map((s: any) => ({ skillId: s.skill_slug, level: s.level })) : [],
          onboardingComplete: true,
          createdAt: profileData.created_at || new Date().toISOString(),
        };
        save(mappedProfile);
        
        try {
          const [gapData, roadmapData, courseProgressData, matchesData] = await Promise.all([
            getGapAnalysis(session.access_token),
            getRoadmap(session.access_token),
            getDashboardCourseProgress(session.access_token).catch(() => []),
            getUserJobMatches(session.access_token).catch(() => []),
          ]);

          setGap(gapData);
          setRoadmap(roadmapData);
          setJobMatches(Array.isArray(matchesData) ? matchesData : []);

          const validCourses = Array.isArray(courseProgressData)
            ? courseProgressData.filter((c: any) => c && (c.course_id || c.id))
            : [];

          setEnrolledCourses(validCourses);
        } catch (gapErr) {
          console.warn("No se pudieron cargar brecha y roadmap:", gapErr);
          setGap({ target_role: null, mastered: [], partial: [], missing: [], coverage: 0 });
          setRoadmap([]);
        }
      } catch (err: any) {
        console.error("Error al conectar con el backend:", err);
        if (err?.response?.status === 401) {
          router.push("/login");
          return;
        }
      } finally {
        setLoadingData(false);
      }
    };

    loadAllData();
  }, [session, router, save]);

  const loading = !hydrated || authLoading || loadingData;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-on-surface">Aún no tienes perfil</h1>
        <p className="mt-2 text-on-surface-variant">Crea tu perfil para ver tu dashboard personalizado.</p>
        <Link href="/login" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/80">
          Empezar
        </Link>
      </div>
    );
  }

  const target = roles.find((r) => r.id === profile.targetRoleId) ?? roles[0];
  const levels: any[] = Array.isArray(roadmap) ? roadmap : [];
  const totalHours = levels.reduce(
    (acc: number, l: any) => acc + (l.skills ?? []).reduce((a: number, s: any) => a + (s.estHours ?? 0), 0),
    0
  );
  const coverage = gap?.coverage ?? 0;
  const mastered: any[] = gap?.mastered ?? [];
  const partial: any[] = gap?.partial ?? [];
  const missing: any[] = gap?.missing ?? [];
  const progressPct = Math.round(coverage * 100);
  const focusPhrase = pickFocusPhrase();
  const skillDemand = marketOverview?.skill_demand ?? [];
  const totalJobs = marketOverview?.total_jobs ?? 0;

  // Siguiente acción recomendada: primer skill en missing o partial
  const nextSkillObj = missing[0] || partial[0] || null;
  const nextSkillSlug = nextSkillObj ? (nextSkillObj.skill_slug || nextSkillObj.skillId) : null;
  const nextSkillName = nextSkillObj ? (nextSkillObj.name || nextSkillSlug) : null;
  const nextSkillDemand = nextSkillSlug ? skillDemand.find((d) => d.slug === nextSkillSlug) : null;
  const nextSkillDemandPct = nextSkillDemand ? Math.round(nextSkillDemand.frequency * 100) : null;

  // Nivel activo del roadmap
  const activeLevelObj = levels.find((lvl: any) =>
    (lvl.skills ?? []).some((s: any) => !mastered.some((m: any) => (m.skill_slug || m.skillId) === (s.skill_slug || s.slug)))
  ) || levels[0];
  const activeLevelNumber = activeLevelObj ? activeLevelObj.level : 1;
  const totalLevelsCount = levels.length > 0 ? levels.length : 5;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* ===================================================================== */}
      {/* INTENCIÓN 1: ORIENTACIÓN Y ENFOQUE INMEDIATO (¿Quién soy y qué hago?) */}
      {/* ===================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold md:text-3xl text-gray-900">
                {profile.fullName ? `¡Hola, ${profile.fullName.split(" ")[0]}!` : "¡Hola!"} 👋
              </h1>
              <span className="inline-flex rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {profile.isGraduated ? "Egresado" : `Ciclo ${profile.cycle || "9"}`} · {profile.career || "Ingeniería"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-600">
              Tu ruta personalizada hacia <span className="font-semibold text-gray-900">{target.label}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white border border-gray-200/80 px-3.5 py-1.5 text-xs font-semibold text-orange-500 shadow-2xs">
              <span className="text-sm">🔥</span> Racha: <span className="text-gray-900 font-bold">10 días</span>
            </div>
            <button
              type="button"
              onClick={startTour}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-surface-variant px-3 text-xs font-semibold text-primary hover:bg-primary/15 transition shadow-2xs"
              title="Iniciar tour guiado interactivo"
            >
              <Compass className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tour guiado</span>
            </button>
            <Link
              href="/perfil"
              className="inline-flex h-8 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-2xs"
            >
              Ajustar perfil
            </Link>
          </div>
        </div>

        {/* Hero Grid: Progreso General + TU SIGUIENTE ACCIÓN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Bloque Izquierdo: Progreso General */}
          <div
            data-tour="dashboard-hero"
            className="lg:col-span-7 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6E43FF] via-[#8B5CF6] to-[#FF7A45] p-6 text-white shadow-glow md:p-7 flex flex-col justify-between"
          >
            <div className="absolute inset-0 pointer-events-none">
              <img
                src="/img/mountain-illustration.png"
                alt="Ilustración de progreso hacia la meta"
                className="absolute right-0 top-0 h-full w-full object-cover opacity-85"
              />
              <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#5B2FE0]/95 via-[#6E43FF]/70 to-transparent"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/80 font-medium">Meta: {profile.targetMonths || 6} meses (~{totalHours}h)</span>
              </div>

              <div className="mt-4 flex items-baseline gap-3">
                <p className="font-display text-5xl md:text-6xl font-extrabold tracking-tight">{progressPct}%</p>
                <div className="text-xs text-white/90 leading-tight">
                  <p className="font-bold text-white">Dominio del rol</p>
                  <p className="text-white/70">{mastered.length} de {target.core_skill_slugs?.length ?? 12} skills clave</p>
                </div>
              </div>

              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-black/20 p-0.5">
                <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-white/90 leading-snug">
                💡 <em>&quot;{focusPhrase}&quot;</em>
              </p>
              <Link
                href="/roadmap"
                className="inline-flex h-9 items-center justify-center whitespace-nowrap gap-1.5 rounded-xl bg-white px-4 text-xs font-bold text-[#6E43FF] shadow-md transition-transform hover:scale-105"
              >
                Ver mapa completo en Roadmap →
              </Link>
            </div>
          </div>

          {/* Bloque Derecho: TU SIGUIENTE ACCIÓN RECOMENDADA con Border Beam Animado (Morado & Naranja) */}
          <div
            data-tour="dashboard-next-action"
            className="lg:col-span-5 relative rounded-3xl p-[2.5px] overflow-hidden shadow-card transition-shadow hover:shadow-highlight flex flex-col group"
          >
            {/* Border Beam: Haz de luz animado en bucle continuo de color morado (#6E43FF) y naranja (#FF8A00) */}
            <div
              className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] pointer-events-none"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, #FF8A00 295deg, #6E43FF 330deg, #FF8A00 360deg)",
              }}
            />

            {/* Contenedor interior de la card */}
            <div className="relative z-10 flex-1 w-full rounded-[22px] bg-white p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-white to-indigo-50/20">
              <div className="absolute top-0 right-0 px-3.5 py-1 bg-gradient-to-r from-primary to-orange-500 text-white text-[10px] font-extrabold rounded-bl-2xl uppercase tracking-wider shadow-2xs">
                Recomendación de hoy
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                  Tu siguiente acción prioritaria
                </div>

                {nextSkillName ? (
                  <>
                    <h3 className="font-display font-bold text-gray-900 text-lg mt-2 leading-snug">
                      Avanza en tu Nivel {activeLevelNumber}: Desarrolla <span className="text-primary font-extrabold">{nextSkillName}</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {nextSkillDemandPct
                        ? `Aparece en el ${nextSkillDemandPct}% de las ofertas del mercado peruano para este rol.`
                        : "Es una de las habilidades requeridas para completar tu siguiente nivel en el roadmap."}
                    </p>

                    <div className="mt-4 p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {getSkillIcon(nextSkillSlug || "code", 18)}
                        </div>
                        <div className="text-xs min-w-0">
                          <p className="font-bold text-gray-900 truncate">Cursos recomendados para {nextSkillName}</p>
                          <p className="text-gray-500 text-[11px]">Enfocado en cerrar tu brecha técnica</p>
                        </div>
                      </div>
                      <Link
                        href={`/cursos?skill=${nextSkillSlug}`}
                        className="inline-flex items-center justify-center shrink-0 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition"
                      >
                        Ver cursos
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="mt-3">
                    <h3 className="font-display font-bold text-gray-900 text-base">¡Felicidades! Has completado todas las skills clave</h3>
                    <p className="text-xs text-gray-600 mt-1">Explora cursos avanzados o postula a ofertas laborales directamente.</p>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center gap-2.5">
                <Link
                  href={nextSkillSlug ? `/cursos?skill=${nextSkillSlug}` : "/roadmap"}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6E43FF] to-[#8B5CF6] hover:from-[#5B2FE0] hover:to-[#7C3AED] text-white text-xs font-bold shadow-md transition transform active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-orange-300" /> Comenzar esta habilidad
                </Link>
                <Link
                  href="/roadmap"
                  className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold transition"
                  title="Ver en Roadmap"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* INTENCIÓN 2: RITMO DE ESTUDIO & PREPARACIÓN (Cursos + Roadmap + KPIs)  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Principal (8 cols): Mis Cursos Activos + Estado del Roadmap */}
        <div className="lg:col-span-8 space-y-6">

          {/* SECCIÓN: MIS CURSOS ACTIVOS */}
          <section data-tour="dashboard-courses" className="surface-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h2 className="font-display font-bold text-gray-900 text-base md:text-lg">
                    Mis Cursos Activos ({enrolledCourses.length})
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Continúa donde lo dejaste en cada curso para mantener tu avance semanal.
                </p>
              </div>

              <Link href="/cursos" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Explorar catálogo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="space-y-3">
                {enrolledCourses.map((item: any, index: number) => {
                  const courseId = item.course_id || item.id;
                  const courseTitle = item.course_title || item.title || `Curso #${courseId}`;
                  const skillSlug = item.skill_slug;

                  return (
                    <div
                      key={courseId || index}
                      className="rounded-2xl border border-gray-200/90 bg-white p-4 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1 flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {getSkillIcon(skillSlug || "code", 20)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                              {skillSlug ? `Skill: ${skillSlug}` : "Inscrito"}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-gray-900 text-sm md:text-base truncate">
                            {courseTitle}
                          </h3>

                          {item.progress && item.progress.total > 0 && (
                            <div className="mt-2 max-w-xs flex items-center gap-2.5">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                  style={{ width: `${item.progress.percentage}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                                {item.progress.percentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/courses/${courseId}/modules`}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-bold text-white hover:bg-primary/90 shrink-0 shadow-2xs transition"
                      >
                        Continuar <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                <BookOpen className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-3 font-display font-semibold text-gray-900 text-sm">No tienes cursos activos en este momento</h3>
                <p className="mt-1 text-xs text-gray-500 max-w-md mx-auto">
                  Elige un curso vinculado a las habilidades de tu roadmap para comenzar a registrar tu progreso de estudio.
                </p>
                <Link
                  href="/cursos"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-2xs"
                >
                  Explorar Catálogo de Cursos <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </section>

          {/* SECCIÓN: ESTADO DEL ROADMAP POR NIVELES */}
          <section data-tour="dashboard-roadmap-status" className="surface-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <h2 className="font-display font-bold text-gray-900 text-base md:text-lg">
                    Estado de tu Roadmap para {target.label}
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nivel activo: <span className="font-bold text-gray-900">Nivel {activeLevelNumber}</span> de {totalLevelsCount} niveles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <Badge className="bg-emerald-50 text-emerald-800 hover:bg-emerald-50 border border-emerald-200">
                  ✓ {mastered.length} dominadas
                </Badge>
                <Badge className="bg-amber-50 text-amber-800 hover:bg-amber-50 border border-amber-200">
                  ◐ {partial.length} en progreso
                </Badge>
                <Badge variant="outline" className="border-gray-200 text-gray-600">
                  ◯ {missing.length} por aprender
                </Badge>
              </div>
            </div>

            {/* Mini resumen visual de niveles */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
              {[1, 2, 3, 4, 5].map((lvlNum) => {
                const isCompleted = lvlNum < activeLevelNumber;
                const isCurrent = lvlNum === activeLevelNumber;
                const levelData = levels.find((l: any) => l.level === lvlNum);
                const label = levelData?.label || `Nivel ${lvlNum}`;

                return (
                  <div
                    key={lvlNum}
                    className={`p-3 rounded-2xl text-center border transition-all ${
                      isCompleted
                        ? "bg-emerald-50/70 border-emerald-200"
                        : isCurrent
                          ? "bg-indigo-50 border-2 border-primary shadow-2xs"
                          : "bg-gray-50 border-gray-200 opacity-65"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? "✓" : lvlNum}
                    </div>
                    <p className={`text-xs font-bold mt-2 truncate ${isCurrent ? "text-primary" : "text-gray-900"}`}>
                      Nivel {lvlNum}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                      {isCompleted ? "Completado" : isCurrent ? "En curso" : label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Cobertura general: <strong>{progressPct}%</strong> · Horas pendientes: <strong>~{totalHours}h</strong>
              </span>
              <Link href="/roadmap" className="font-bold text-primary hover:underline flex items-center gap-1">
                Ver detalle de habilidades <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* Logros */}
          <DashboardAchievementsWidget />

        </div>

        {/* Columna Lateral (4 cols): Métricas Resumidas + Top Skills Demandadas */}
        <div className="lg:col-span-4 space-y-6">

          {/* Cuadrícula 2x2 de Métricas Clave */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Cobertura"
              value={`${progressPct}%`}
              hint={`${mastered.length}/${target.core_skill_slugs?.length ?? 12} skills`}
              tooltip="Porcentaje de habilidades clave que ya dominas para tu rol objetivo según tu perfil."
            />
            <StatCard
              label="Por aprender"
              value={String(missing.length)}
              hint="Priorizadas"
              tooltip="Habilidades prioritarias que las empresas peruanas exigen y que aún te falta desarrollar."
            />
            <StatCard
              label="Horas est."
              value={`${totalHours}h`}
              hint="Ruta completa"
              tooltip="Tiempo aproximado para completar toda tu ruta estudiando a tu ritmo semanal actual."
            />
            <StatCard
              label="Ofertas PE"
              value={String(totalJobs)}
              hint="Mercado analizado"
              tooltip="Vacantes reales en el mercado peruano analizadas para calcular tu encaje y nivel de match."
            />
          </div>

          {/* Top Skills Demandadas en el Mercado */}
          <section className="surface-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-gray-900 text-sm">
                Skills más pedidas en Perú
              </h2>
              <span className="text-[11px] text-gray-400">{totalJobs} vacantes</span>
            </div>

            <ul className="space-y-3">
              {skillDemand.slice(0, 6).map((s) => {
                const userHas = profile.skills.some((us) => us.skillId === s.slug);
                return (
                  <li key={s.slug}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-800">{s.name}</span>
                      {userHas ? (
                        <span className="font-bold text-emerald-600 text-[11px]">✓ Tienes ({Math.round(s.frequency * 100)}%)</span>
                      ) : (
                        <span className="font-semibold text-gray-400 text-[11px]">◯ Falta ({Math.round(s.frequency * 100)}%)</span>
                      )}
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${userHas ? "bg-emerald-500" : "bg-primary/50"}`}
                        style={{ width: `${s.frequency * 100}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

        </div>

      </div>

      {/* ===================================================================== */}
      {/* INTENCIÓN 3: MERCADO LABORAL & OPORTUNIDADES REALES                     */}
      {/* ===================================================================== */}
      <section data-tour="dashboard-jobs" className="surface-card p-6 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Building2 className="w-4 h-4" />
              </span>
              <h2 className="font-display text-lg font-bold text-gray-900">
                Oportunidades Laborales — Match con tu Perfil
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Calculado en tiempo real según las habilidades verificadas en tu perfil.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            {totalJobs} ofertas analizadas
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {jobMatches.slice(0, 4).map((jm) => {
            const companyLogo = getCompanyLogo(jm.job.company);
            const is100 = jm.match_percentage === 100;
            const firstMissing = jm.missing_skills[0];
            const estHours = jm.missing_skills.length * 6;

            return (
              <div
                key={jm.job.id}
                className={`rounded-3xl border ${getCardBorderClass(jm.match_percentage)} bg-white p-5 md:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {companyLogo ? (
                          <div className="relative group/logo flex items-center justify-center h-8 px-2.5 bg-gray-50 rounded-xl border border-gray-200/70 shrink-0 cursor-pointer">
                            <img
                              src={companyLogo}
                              alt={jm.job.company || "Empresa"}
                              className="h-4 max-w-[75px] object-contain rounded"
                            />
                            <div className="pointer-events-none absolute -top-8 left-0 z-30 hidden rounded-md bg-gray-900 px-2 py-1 text-[11px] font-semibold text-white shadow-md group-hover/logo:block whitespace-nowrap">
                              {jm.job.company}
                            </div>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 h-8 px-2.5 bg-gray-50 rounded-xl border border-gray-200/70 text-xs font-semibold text-gray-700">
                            <Building2 className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span>{jm.job.company || "Empresa confidencial"}</span>
                          </div>
                        )}
                        {jm.job.location && (
                          <span className="text-xs text-gray-400">· {jm.job.location}</span>
                        )}
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${getSeniorityColor(jm.job.seniority)}`}>
                          {jm.job.seniority || "Junior"}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-gray-900 text-base md:text-lg leading-snug">
                        {jm.job.position}
                      </h3>
                    </div>

                    <MatchRadialGauge percentage={jm.match_percentage} />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold uppercase tracking-wider text-gray-400 text-[10px]">Salario:</span>
                      <span className="font-extrabold text-gray-900 text-sm">{formatSalary(jm.job.salary)}</span>
                      {jm.job.salary && <span className="text-gray-400 font-normal">/ mes</span>}
                    </div>
                    {is100 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Perfil 100% listo
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 font-medium">
                        {jm.matched_skills.length} de {jm.job.skill_slugs.length} requisitos
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5 space-y-2.5">
                    {jm.matched_skills.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          Dominadas ({jm.matched_skills.length})
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {jm.matched_skills.map((slug) => (
                            <span
                              key={slug}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-medium border border-emerald-100"
                            >
                              <span className="shrink-0">{getSkillIcon(slug, 12)}</span>
                              <span>✓ {slug}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {jm.missing_skills.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                          Habilidades por cerrar ({jm.missing_skills.length})
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {jm.missing_skills.slice(0, 4).map((slug) => (
                            <span
                              key={slug}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 text-red-600 px-2 py-0.5 text-xs font-medium border border-red-100"
                            >
                              <span className="shrink-0">{getSkillIcon(slug, 12)}</span>
                              <span>✗ {slug}</span>
                            </span>
                          ))}
                          {jm.missing_skills.length > 4 && (
                            <span className="rounded-lg bg-gray-100 text-gray-500 px-2 py-0.5 text-xs font-medium">
                              +{jm.missing_skills.length - 4} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  {is100 ? (
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> ¡Listo para postular!
                    </span>
                  ) : jm.missing_skills.length === 1 ? (
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Solo 1 skill para 100%
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Brecha: ~{estHours}h de estudio
                    </span>
                  )}

                  {is100 ? (
                    <Link
                      href="/roadmap"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all"
                    >
                      Ver en Roadmap <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={firstMissing ? `/cursos?skill=${firstMissing}` : "/cursos"}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-primary px-3.5 py-1.5 rounded-xl text-xs font-bold border border-indigo-200/80 transition-all"
                    >
                      Cerrar Brecha <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {jobMatches.length === 0 && (
          <p className="mt-4 text-center text-sm text-gray-500">Completa tu perfil de habilidades para ver tu compatibilidad con las ofertas del mercado.</p>
        )}
      </section>
    </div>
  );
}

function MatchRadialGauge({ percentage }: { percentage: number }) {
  const isHigh = percentage >= 70;
  const isMid = percentage >= 40;
  
  const ringColor = isHigh ? "text-emerald-500" : isMid ? "text-amber-500" : "text-indigo-500";
  const textColor = isHigh ? "text-emerald-600" : isMid ? "text-amber-600" : "text-indigo-600";
  const labelColor = isHigh ? "text-emerald-500" : isMid ? "text-amber-500" : "text-indigo-500";

  return (
    <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-100"
          strokeWidth="3.5"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${ringColor} transition-all duration-700`}
          strokeDasharray={`${Math.min(100, Math.max(0, percentage))}, 100`}
          strokeWidth="3.5"
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className={`text-xs font-display font-extrabold ${textColor} leading-none`}>
          {percentage}%
        </span>
        <span className={`text-[9px] font-bold ${labelColor} uppercase tracking-tighter mt-0.5`}>
          MATCH
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  tooltip,
}: {
  label: string;
  value: string;
  hint: string;
  tooltip?: string;
}) {
  return (
    <div className="surface-card p-4 sm:p-5 bg-white relative flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 truncate">
            {label}
          </span>
          {tooltip && (
            <div className="relative group/tooltip inline-flex items-center shrink-0">
              <button
                type="button"
                className="text-gray-400 hover:text-primary transition-colors p-0.5 rounded-full focus:outline-none"
                aria-label={`Información sobre ${label}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-52 rounded-xl bg-slate-900 px-3 py-2 text-center text-[11px] font-normal normal-case leading-relaxed text-white shadow-xl backdrop-blur-md">
                {tooltip}
                <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 font-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
      </div>
      <div className="mt-1.5 text-xs text-gray-500">{hint}</div>
    </div>
  );
}