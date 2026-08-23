"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, ArrowRight, CheckCircle2, FileText, ChevronDown, ChevronUp, Lock, Building2, Clock, Zap, Sparkles } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { QuizModal } from "@/components/courses/QuizModal";
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
  getCourseModules,
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

function getMatchColor(pct: number): string {
  if (pct >= 70) return "bg-emerald-100 text-emerald-800";
  if (pct >= 40) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
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
function getModuleStatusLabel(mod: any): string {
  if (mod.attempts === 0) return "Módulo pendiente";
  if (mod.passed) return "Módulo completado";
  return "Falta validar";
}

function getModuleStatusStyle(mod: any): string {
  if (mod.attempts === 0) return "bg-gray-100 text-gray-600";
  if (mod.passed) return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
}

function isModuleLocked(modulesList: any[], index: number): boolean {
  if (index === 0) return false;
  return !modulesList[index - 1]?.passed;
}

export default function DashboardPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated, save } = useProfile();
  const [loadingData, setLoadingData] = useState(true);
  
  const [gap, setGap] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);

  // Estado para almacenar los módulos cargados de cada curso inscrito: { [courseId]: Module[] }
  const [courseModulesMap, setCourseModulesMap] = useState<Record<string, any[]>>({});
  const [loadingModulesId, setLoadingModulesId] = useState<string | null>(null);
  
  // Estado para expandir o contraer las tarjetas de cursos en el dashboard
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  // Estado para el QuizModal activo
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

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
          
          // 🔍 DEBUG 1: Ver qué devuelve exactamente la API de cursos
          console.log("🔍 [DEBUG] courseProgressData recibido:", courseProgressData);

          setGap(gapData);
          setRoadmap(roadmapData);
          setJobMatches(Array.isArray(matchesData) ? matchesData : []);
          
          // Filtramos de forma flexible aceptando course_id o id
          const validCourses = Array.isArray(courseProgressData) 
            ? courseProgressData.filter((c: any) => c && (c.course_id || c.id)) 
            : [];
          
          console.log("🔍 [DEBUG] validCourses filtrados:", validCourses);
          setEnrolledCourses(validCourses);

          // Precargamos los módulos para cada curso inscrito de manera automática
          // Precargamos los módulos para cada curso inscrito de manera automática
          if (validCourses.length > 0) {
            const modulesMap: Record<string, any[]> = {};
            for (const course of validCourses) {
              const currentCourseId = (course as any).course_id || (course as any).id || (course as any).courseId;
              if (!currentCourseId) continue;
              try {
                console.log(`🔍 [DEBUG] Solicitando módulos para el curso ID: ${currentCourseId}`);
                const mods = await getCourseModules(session.access_token, Number(currentCourseId));
                
                console.log(`🔍 [DEBUG] Módulos obtenidos para curso ${currentCourseId}:`, mods);
                if (Array.isArray(mods)) {
                  modulesMap[String(currentCourseId)] = mods.sort((a, b) => a.module_order - b.module_order);
                }
              } catch (modErr) {
                console.error(`Error cargando módulos del curso ${currentCourseId}:`, modErr);
              }
            }
            setCourseModulesMap(modulesMap);
          }

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

  // Alternar expansión del curso para ver sus módulos
  const toggleCourseExpand = async (courseId: string | number) => {
    const idStr = String(courseId);
    const isCurrentlyExpanded = !!expandedCourses[idStr];
    
    setExpandedCourses(prev => ({ ...prev, [idStr]: !isCurrentlyExpanded }));

    // Si no tenemos sus módulos cargados aún, los pedimos
    if (!isCurrentlyExpanded && !courseModulesMap[idStr] && session) {
      try {
        setLoadingModulesId(idStr);
        const mods = await getCourseModules(session.access_token, Number(courseId));
        if (Array.isArray(mods)) {
          setCourseModulesMap(prev => ({
            ...prev,
            [idStr]: mods.sort((a, b) => a.module_order - b.module_order)
          }));
        }
      } catch (e) {
        console.error("Error al expandir módulos del curso:", e);
      } finally {
        setLoadingModulesId(null);
      }
    }
  };
  const refreshModulesForCourse = async (courseId: string | number) => {
  if (!session) return;
  const idStr = String(courseId);
  try {
    const mods = await getCourseModules(session.access_token, Number(courseId));
    if (Array.isArray(mods)) {
      setCourseModulesMap(prev => ({
        ...prev,
        [idStr]: mods.sort((a, b) => a.module_order - b.module_order)
      }));
    }
  } catch (e) {
    console.error("Error al refrescar módulos:", e);
  }
};

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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-1">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl text-gray-900">
              {profile.fullName ? `¡Hola, ${profile.fullName.split(" ")[0]}!` : "¡Hola!"} 👋
            </h1>
            <p className="mt-0.5 text-sm text-gray-600">
              Tu ruta personalizada hacia <span className="font-semibold text-gray-900">{target.label}</span>
            </p>
          </div>
          
          <div className="flex shrink-0 items-center gap-2 rounded-full bg-white border border-gray-100 px-4 py-2 text-sm font-semibold text-orange-500 shadow-sm">
            🔥 Racha de <span className="text-gray-900">10 días</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6E43FF] via-[#8B5CF6] to-[#FF7A45] p-6 text-white shadow-glow md:p-8">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/img/mountain-illustration.png"
              alt="Ilustración de progreso hacia la meta"
              className="absolute right-0 top-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-[#5B2FE0]/90 via-[#6E43FF]/60 to-transparent"></div>
          </div>

          <div className="relative z-10 grid gap-6 md:grid-cols-[280px_1fr_auto] items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/90">Tu progreso general</p>
              <p className="mt-1 font-display text-5xl md:text-6xl font-bold tracking-tight">{progressPct}%</p>
              
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              
              <p className="mt-3 text-sm text-white/90 leading-snug">Sigue así, cada paso te acerca a tu objetivo.</p>
              
              <Link
                href="/roadmap"
                className="mt-5 inline-flex h-10 items-center justify-center whitespace-nowrap gap-1.5 rounded-xl bg-white px-5 text-sm font-semibold text-[#6E43FF] shadow-md transition-transform hover:scale-105"
              >
                Ver mi roadmap →
              </Link>
            </div>

            <div className="hidden md:block"></div>

            <div className="flex justify-center md:justify-end">
              <div className="w-full sm:w-72 rounded-2xl bg-white p-4 text-gray-900 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-800">⚙️ Enfoque de hoy</p>
                  <span className="text-gray-400 font-bold tracking-widest text-xs">•••</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-600">{focusPhrase}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-on-surface-variant">
            Objetivo: <span className="font-medium text-on-surface">{target.label}</span> · Ciclo {profile.cycle}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/perfil" className="inline-flex h-8 items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low px-3 text-sm font-medium">
            Editar perfil
          </Link>
          <Link href="/onboarding" className="inline-flex h-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/80 px-3 text-sm font-medium">
            Rehacer onboarding
          </Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Cobertura del rol" value={`${progressPct}%`} hint={`${mastered.length}/${target.core_skill_slugs?.length ?? 0} skills clave dominadas`} />
        <StatCard label="Skills por aprender" value={String(missing.length)} hint="Priorizadas por demanda" />
        <StatCard label="Horas estimadas" value={`${totalHours}h`} hint="Roadmap completo" />
        <StatCard label="Ofertas analizadas" value={String(totalJobs)} hint="Mercado peruano" />
      </div>

      <section className="surface-card mt-6 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-on-surface">Tu preparación para {target.label}</h2>
          <span className="text-sm text-on-surface-variant">{progressPct}%</span>
        </div>
        <Progress value={coverage * 100} className="h-3" />
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ {mastered.length} dominadas</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">◐ {partial.length} en progreso</Badge>
          <Badge variant="destructive">◯ {missing.length} por aprender</Badge>
        </div>
      </section>

      <DashboardAchievementsWidget />

      {/* SECCIÓN: MIS CURSOS (ESTRICTAMENTE INSCRITOS EN user_skill_courses) */}
      <section className="surface-card mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-on-surface">Mis Cursos Activos</h2>
            <p className="text-sm text-on-surface-variant">Despliega cada curso para ver sus módulos y realizar las evaluaciones correspondientes.</p>
          </div>
          <Link href="/cursos" className="text-sm font-medium text-primary hover:underline">
            Explorar catálogo →
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid gap-4">
            {enrolledCourses.map((item: any, index: number) => {
              const courseId = item.course_id || item.id;
              const courseTitle = item.course_title || item.title || `Curso #${courseId}`;
              const skillSlug = item.skill_slug;
              const isExpanded = !!expandedCourses[String(courseId)];
              const modulesList = courseModulesMap[String(courseId)] || [];
              const isLoadingMods = loadingModulesId === String(courseId);

              return (
                <div key={courseId || index} className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {skillSlug ? `Skill: ${skillSlug}` : "Inscrito"}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-gray-900 text-base md:text-lg">{courseTitle}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCourseExpand(courseId)}
                        className="gap-2 text-xs font-semibold"
                      >
                        {isExpanded ? "Ocultar Módulos" : "Ver Módulos y Tests"}
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      
                      <Link
                        href={`/courses/${courseId}/modules`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-white hover:bg-primary/80"
                      >
                        Ir al Curso <ArrowRight className="h-3 w-3" />
                        
                      </Link>
                    </div>
                  </div>

                  {/* DESPLEGABLE DE MÓDULOS Y ESTADOS DE TESTS */}
                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Módulos de aprendizaje y evaluaciones
                      </h4>

                      {isLoadingMods ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : modulesList.length > 0 ? (
                        <div className="space-y-2.5">
                          {modulesList.map((mod: any, mIdx: number) => {
                            const locked = isModuleLocked(modulesList, mIdx);
                            const statusLabel = getModuleStatusLabel(mod);
                            const statusStyle = getModuleStatusStyle(mod);

                            return (
                              <div
                                key={mod.id || mIdx}
                                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-3.5 border ${
                                  locked ? "bg-gray-50 border-gray-100 opacity-60" : "bg-surface-container-low border-outline-variant/60"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white font-bold text-xs text-primary border border-gray-200">
                                    {mIdx + 1}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{mod.title || `Módulo ${mIdx + 1}`}</p>
                                    {mod.content_summary && (
                                        <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed mt-1">
                                          {mod.content_summary}
                                        </p>
                                      )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}>
                                    {mod.passed && <CheckCircle2 className="h-3.5 w-3.5" />}
                                    {statusLabel}
                                    {mod.best_score !== null && mod.best_score !== undefined && mod.attempts > 0
                                      ? ` · Mejor: ${Math.round(mod.best_score / 10)}/10`
                                      : ""}
                                  </span>

                                  {locked ? (
                                    <span className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-gray-200 px-3 text-xs font-medium text-gray-500">
                                      <Lock className="h-3.5 w-3.5" /> Bloqueado
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => setActiveModuleId(mod.id)}
                                      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors shadow-sm ${
                                        mod.passed
                                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                                          : "bg-primary text-white hover:bg-primary/80"
                                      }`}
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                      {mod.passed ? "Volver a practicar" : mod.attempts > 0 ? "Reintentar" : "Hacer Test"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 py-3 italic text-center">
                          No hay módulos registrados para este curso todavía.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-outline-variant p-8 text-center bg-white">
            <BookOpen className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-display font-semibold text-on-surface">No tienes cursos activos en este momento</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Explora el catálogo general de cursos o las recomendaciones de tu roadmap para inscribirte en tu primer curso.</p>
            <Button className="mt-4">
              <Link href="/cursos">Explorar Catálogo de Cursos</Link>
            </Button>
          </div>
        )}
      </section>

      {/* RENDERIZADO DEL MODAL DE EVALUACIÓN (QUIZ MODAL) */}
      {activeModuleId && (
  <QuizModal
    moduleId={activeModuleId}
    onClose={() => setActiveModuleId(null)}
    onComplete={() => {
      const courseWithModule = enrolledCourses.find((c: any) =>
        (courseModulesMap[String(c.course_id || c.id)] || []).some((m: any) => m.id === activeModuleId)
      );
      if (courseWithModule) {
        refreshModulesForCourse(courseWithModule.course_id || courseWithModule.id);
      }
    }}
  />
)}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="surface-card lg:col-span-2 p-6">
          <h2 className="font-display text-lg font-semibold text-on-surface">Top skills demandadas en el mercado</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Frecuencia de aparición en {totalJobs} ofertas analizadas.</p>
          <ul className="mt-5 space-y-3">
            {skillDemand.slice(0, 10).map((s) => {
              const userHas = profile.skills.some((us) => us.skillId === s.slug);
              return (
                <li key={s.slug} className="flex items-center gap-4">
                  <div className="w-32 shrink-0 text-sm font-medium text-on-surface">{s.name}</div>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full gradient-brand"
                      style={{ width: `${s.frequency * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs text-on-surface-variant">{Math.round(s.frequency * 100)}%</div>
                  {userHas ? (
                    <Badge className="w-20 justify-center bg-green-100 text-green-800 hover:bg-green-100">Tienes</Badge>
                  ) : (
                    <Badge variant="outline" className="w-20 justify-center text-on-surface-variant border-outline-variant">Falta</Badge>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="surface-card p-6">
          <h2 className="font-display text-lg font-semibold text-on-surface">Próximos pasos</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Empieza por lo más rentable.</p>
          <ol className="mt-4 space-y-3">
            {missing.slice(0, 5).map((m: any, i: number) => {
              const slug = m.skill_slug || m.skillId;
              const demandItem = skillDemand.find((d) => d.slug === slug);
              const demandPct = demandItem ? Math.round(demandItem.frequency * 100) : 0;
              return (
                <li key={slug || i} className="flex items-start gap-3 rounded-lg border border-outline-variant p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-on-surface">{m.name}</div>
                    <div className="text-xs text-on-surface-variant">
                      Demanda: {demandPct}%
                    </div>
                  </div>
                  <Link href={`/cursos?skill=${slug}`} className="inline-flex h-7 items-center justify-center rounded-md hover:bg-muted text-primary px-2.5 text-[0.8rem] font-medium">
                    Cursos
                  </Link>
                </li>
              );
            })}
            {missing.length === 0 && (
              <li className="rounded-lg border border-outline-variant p-4 text-sm text-on-surface-variant">
                🎉 Dominas todas las skills clave del rol. Explora los <Link href="/cursos" className="text-primary hover:underline">cursos avanzados</Link>.
              </li>
            )}
          </ol>
        </section>
      </div>

      <section className="surface-card mt-6 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Ofertas laborales — Tu compatibilidad & Plan de acción</h2>
            <p className="text-xs text-gray-500 mt-0.5">Evalúa tu nivel de encaje con el mercado y desbloquea oportunidades cerrando brechas clave.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            {totalJobs} ofertas analizadas
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {jobMatches.slice(0, 6).map((jm) => {
            const companyLogo = getCompanyLogo(jm.job.company);
            const is100 = jm.match_percentage === 100;
            const firstMissing = jm.missing_skills[0];
            const estHours = jm.missing_skills.length * 6;

            return (
              <div
                key={jm.job.id}
                className={`rounded-3xl border ${getCardBorderClass(jm.match_percentage)} bg-white p-5 md:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Cabecera: Empresa + Cargo + Seniority + Radial Gauge */}
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
                            {/* Tooltip */}
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

                    {/* Medidor Radial Gauge */}
                    <MatchRadialGauge percentage={jm.match_percentage} />
                  </div>

                  {/* Línea de Compensación */}
                  <div className="mt-3.5 flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold uppercase tracking-wider text-gray-400">Salario:</span>
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

                  {/* Desglose de Habilidades */}
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

                {/* Footer con Acción & Estimación de Esfuerzo */}
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
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all"
                    >
                      Ver en Roadmap <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={firstMissing ? `/cursos?skill=${firstMissing}` : "/cursos"}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-indigo-200/80 transition-all"
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
          <p className="mt-4 text-center text-sm text-on-surface-variant">Completa tu perfil de habilidades para ver tu compatibilidad con las ofertas del mercado.</p>
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

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="surface-card p-5 bg-white">
      <div className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold text-on-surface">{value}</div>
      <div className="mt-1 text-xs text-on-surface-variant">{hint}</div>
    </div>
  );
}