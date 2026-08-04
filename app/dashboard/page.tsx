"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  getBackendProfile,
  upsertBackendProfile,
  getGapAnalysis,
  getRoadmap,
  getCatalogJobs,
  getCatalogSkills,
  getCatalogRoles,
  isOnboardingComplete,
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

export default function DashboardPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated, save, clear } = useProfile();
  const [loadingData, setLoadingData] = useState(true);
  
  const [gap, setGap] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

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
          // Si el perfil no existe en la base de datos (404), intentamos sincronizar desde localStorage si existe
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
          // Sin perfil, o con el onboarding del chatbot a medias: lo retomamos.
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
          targetRoleId: profileData.target_role_id || "fullstack",
          interests: profileData.interests || [],
          // experience_level guarda la etapa académica de la HU-29; los tipos de
          // experiencia siguen viviendo solo en el perfil local.
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
          const [gapData, roadmapData] = await Promise.all([
            getGapAnalysis(session.access_token),
            getRoadmap(session.access_token)
          ]);
          setGap(gapData);
          setRoadmap(roadmapData);
        } catch (gapErr) {
          console.warn("No se pudieron cargar brecha y roadmap:", gapErr);
          // El fallback debe respetar el contrato del backend
          // (GapAnalysisResponse y List[RoadmapLevel]); si no, el render
          // revienta al leer gap.coverage o level.skills.
          setGap({ target_role: null, mastered: [], partial: [], missing: [], coverage: 0 });
          setRoadmap([]);
          setAnalysisFailed(true);
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

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    localStorage.removeItem("access_token");
    clear();
    router.push("/login");
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
  // roadmap y gap pueden seguir en null si la carga se cortó antes del catch.
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
  const quote = pickQuote(profile.fullName || "", progressPct);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {analysisFailed && (
        <div className="mb-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
          No pudimos calcular tu brecha de habilidades ni tu roadmap. Los indicadores de abajo están en cero
          hasta que el análisis vuelva a responder.
        </div>
      )}

      {/* FastAPI Safe Connection status Header */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-outline-variant bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-green-50 p-2 text-green-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">Conexión Segura FastAPI</h2>
            <p className="text-xs text-on-surface-variant">
              Sesión activa: {session?.user?.email || profile.email}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Cerrar Sesión
        </Button>
      </div>

      <section className="mb-6 overflow-hidden rounded-2xl gradient-brand p-6 text-white shadow-glow md:p-8">
        <p className="text-xs uppercase tracking-widest text-white/80">Tu ruta hacia {target.label}</p>
        <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">
          {profile.fullName ? `¡Hola, ${profile.fullName.split(" ")[0]}!` : "¡Hola!"} {quote.emoji}
        </h1>
        <p className="mt-2 max-w-2xl text-white/90">{quote.text}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <div className="mb-1 flex items-center justify-between text-xs text-white/80">
              <span>Avance de tu roadmap</span>
              <span className="font-semibold">{progressPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full bg-white transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/roadmap" className="inline-flex h-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] px-3 text-sm font-medium">
              Ver roadmap
            </Link>
            <Link href="/cursos" className="inline-flex h-8 items-center justify-center rounded-lg bg-white text-primary hover:bg-white/90 border border-outline-variant px-3 text-sm font-medium">
              Cursos IA
            </Link>
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

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Cobertura del rol" value={`${progressPct}%`} hint={`${mastered.length}/${target.core_skill_slugs?.length ?? target.coreSkills?.length ?? 0} skills clave dominadas`} />
        <StatCard label="Skills por aprender" value={String(missing.length)} hint="Priorizadas por demanda" />
        <StatCard label="Horas estimadas" value={`${totalHours}h`} hint="Roadmap completo" />
        <StatCard label="Ofertas analizadas" value={String(jobs.length)} hint="Mercado peruano" />
      </div>

      {/* Coverage bar */}
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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Top demand */}
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

        {/* Next steps */}
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

      {/* Recent jobs */}
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
                  <Badge variant="secondary">{j.seniority}</Badge>
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

function pickQuote(name: string, progress: number): { text: string; emoji: string } {
  const quotes = progress < 25
    ? [
        { text: "Cada experto empezó como principiante. Hoy es un gran día para dar el primer paso.", emoji: "🌱" },
        { text: "La ruta está trazada. Un pequeño avance diario hace una gran diferencia en 6 meses.", emoji: "🚀" },
      ]
    : progress < 60
    ? [
        { text: "Vas por buen camino. Sigue practicando lo que ya sabes y suma nuevas skills sin prisa.", emoji: "⚡" },
        { text: "El progreso invisible de hoy será el resultado visible de mañana.", emoji: "💪" },
      ]
    : progress < 90
    ? [
        { text: "Ya dominas la mayoría de habilidades clave. Es momento de mostrar tus proyectos.", emoji: "🔥" },
        { text: "Estás muy cerca. Enfócate en las últimas piezas y prepara tu portafolio.", emoji: "🎯" },
      ]
    : [
        { text: "¡Impresionante! Estás listo para postular a las mejores prácticas del mercado.", emoji: "🏆" },
        { text: "Domina lo que ya sabes, actualiza tu CV y postula. El empleo tech te espera.", emoji: "✨" },
      ];
  const seed = (name.length + progress) % quotes.length;
  return quotes[seed];
}