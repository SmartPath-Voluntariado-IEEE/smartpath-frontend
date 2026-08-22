"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, BookOpen, ArrowRight, CheckCircle2, FileText, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { QuizModal } from "@/components/courses/QuizModal";
import {
  getBackendProfile,
  upsertBackendProfile,
  getGapAnalysis,
  getRoadmap,
  getCatalogJobs,
  getCatalogSkills,
  getCatalogRoles,
  isOnboardingComplete,
  getDashboardCourseProgress,
  getCourseModules,
} from "@/services/api";
import { loadProfile, type UserProfile } from "@/lib/profile-store";

function extractSkills(text: string, skills: any[]): string[] {
  const lower = " " + text.toLowerCase() + " ";
  const found = new Set<string>();
  for (const s of skills) {
    const names = [s.name, ...(s.aliases ?? [])];
    for (const n of names) {
      const needle = n.toLowerCase();
      const re = new RegExp(`(^|[^a-z0-9\\+#\\.])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9\\+#]|$)`, "i");
      if (re.test(lower)) {
        found.add(s.slug);
        break;
      }
    }
  }
  return [...found];
}

function computeMarketSkillFrequency(jobs: any[], skills: any[]) {
  const counts = new Map<string, number>();
  for (const j of jobs) {
    const text = `${j.position || ""} ${j.description || ""}`;
    for (const slug of extractSkills(text, skills)) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  const total = jobs.length;
  return [...counts.entries()]
    .map(([slug, count]) => {
      const s = skills.find((x) => x.slug === slug)!;
      return { skillId: slug, name: s.name, category: s.category, count, frequency: count / total };
    })
    .sort((a, b) => b.count - a.count);
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
  const [jobs, setJobs] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  // Estado para almacenar los módulos cargados de cada curso inscrito: { [courseId]: Module[] }
  const [courseModulesMap, setCourseModulesMap] = useState<Record<string, any[]>>({});
  const [loadingModulesId, setLoadingModulesId] = useState<string | null>(null);
  
  // Estado para expandir o contraer las tarjetas de cursos en el dashboard
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});

  // Estado para el QuizModal activo
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const DEFAULT_ROLES = [
    { id: "backend", label: "Backend Developer", core_skill_slugs: ["java", "springboot", "rest", "sql", "postgres", "docker", "git", "aws"] },
    { id: "frontend", label: "Frontend Developer", core_skill_slugs: ["javascript", "typescript", "react", "nextjs", "tailwind", "git", "rest"] },
    { id: "fullstack", label: "Full Stack Developer", core_skill_slugs: ["typescript", "react", "nodejs", "postgres", "git", "rest", "docker"] },
    { id: "data-analyst", label: "Data Analyst", core_skill_slugs: ["sql", "excel", "powerbi", "python", "pandas", "english"] },
    { id: "data-engineer", label: "Data Engineer", core_skill_slugs: ["python", "sql", "postgres", "docker", "linux", "gcp", "aws"] },
    { id: "ml", label: "Machine Learning Engineer", core_skill_slugs: ["python", "pandas", "tensorflow", "sql", "docker", "aws", "english"] },
    { id: "devops", label: "DevOps Engineer", core_skill_slugs: ["linux", "docker", "kubernetes", "aws", "git", "python"] }
  ];

  const DEFAULT_SKILLS = [
    { id: 1, slug: "python", name: "Python", category: "language" },
    { id: 2, slug: "javascript", name: "JavaScript", category: "language" },
    { id: 3, slug: "typescript", name: "TypeScript", category: "language" },
    { id: 4, slug: "java", name: "Java", category: "language" },
    { id: 5, slug: "react", name: "React", category: "framework" },
    { id: 6, slug: "nextjs", name: "Next.js", category: "framework" },
    { id: 7, slug: "nodejs", name: "Node.js", category: "framework" },
    { id: 8, slug: "springboot", name: "Spring Boot", category: "framework" },
    { id: 9, slug: "docker", name: "Docker", category: "tool" },
    { id: 10, slug: "sql", name: "SQL", category: "language" },
    { id: 11, slug: "postgres", name: "PostgreSQL", category: "database" },
    { id: 12, slug: "tailwind", name: "Tailwind CSS", category: "framework" },
    { id: 13, slug: "aws", name: "AWS", category: "cloud" },
    { id: 14, slug: "powerbi", name: "Power BI", category: "tool" },
    { id: 15, slug: "pandas", name: "Pandas", category: "framework" },
    { id: 16, slug: "linux", name: "Linux", category: "tool" },
    { id: 17, slug: "git", name: "Git", category: "tool" },
    { id: 18, slug: "rest", name: "REST APIs", category: "concept" }
  ];

  useEffect(() => {
    if (!session) return;

    const loadAllData = async () => {
      try {
        setLoadingData(true);
        const [jobsData, skillsData, rolesData] = await Promise.all([
          getCatalogJobs().catch(() => []),
          getCatalogSkills().catch(() => []),
          getCatalogRoles().catch(() => [])
        ]);
        setJobs(jobsData || []);
        setSkills(skillsData && skillsData.length > 0 ? skillsData : DEFAULT_SKILLS);
        setRoles(rolesData && rolesData.length > 0 ? rolesData : DEFAULT_ROLES);

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
          const [gapData, roadmapData, courseProgressData] = await Promise.all([
            getGapAnalysis(session.access_token),
            getRoadmap(session.access_token),
            getDashboardCourseProgress(session.access_token).catch(() => [])
          ]);
          
          // 🔍 DEBUG 1: Ver qué devuelve exactamente la API de cursos
          console.log("🔍 [DEBUG] courseProgressData recibido:", courseProgressData);

          setGap(gapData);
          setRoadmap(roadmapData);
          
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
              const currentCourseId = course.course_id || course.id || course.courseId;
              try {
                console.log(`🔍 [DEBUG] Solicitando módulos para el curso ID: ${currentCourseId}`);
                const mods = await getCourseModules(session.access_token, currentCourseId);
                
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
  const market = computeMarketSkillFrequency(jobs, skills);
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
        <StatCard label="Ofertas analizadas" value={String(jobs.length)} hint="Mercado peruano" />
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
          <p className="mt-1 text-sm text-on-surface-variant">Frecuencia de aparición en ofertas analizadas.</p>
          <ul className="mt-5 space-y-3">
            {market.slice(0, 10).map((s) => {
              const userHas = profile.skills.some((us) => us.skillId === s.skillId);
              return (
                <li key={s.skillId} className="flex items-center gap-4">
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
              return (
                <li key={slug || i} className="flex items-start gap-3 rounded-lg border border-outline-variant p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-on-surface">{m.name}</div>
                    <div className="text-xs text-on-surface-variant">
                      Demanda: {Math.round(m.marketFreq * 100)}%
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-on-surface">Ofertas recientes analizadas</h2>
          <span className="text-xs text-on-surface-variant">{jobs.length} totales</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {jobs.slice(0, 4).map((j: any) => {
            const jobSkills = skills.filter((s) => new RegExp(`\\b${s.name}\\b`, "i").test(j.description || ""));
            return (
              <div key={j.id} className="rounded-xl border border-outline-variant p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-on-surface">{j.position}</div>
                    <div className="text-sm text-on-surface-variant">{j.company} · {j.location}</div>
                  </div>
                  <Badge variant="secondary" className="text-white">{j.seniority}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {jobSkills.slice(0, 6).map((s: any) => (
                    <span key={s.slug} className="rounded-md bg-surface-container-high text-on-surface-variant px-2 py-0.5 text-xs">{s.name}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
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