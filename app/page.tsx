"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { getCatalogJobs, getCatalogSkills } from "@/services/api";

const DEFAULT_JOBS = [
  { id: 1, company: "Rappi Perú", position: "Practicante Backend Developer", location: "Lima, Remoto", seniority: "Practicante", description: "Java, Spring Boot, REST APIs, Git, Docker, PostgreSQL." },
  { id: 2, company: "BCP", position: "Practicante Data Analyst", location: "Lima, Perú", seniority: "Practicante", description: "SQL, Excel, Power BI, Python, Pandas." },
  { id: 3, company: "Culqi", position: "Full Stack Developer Jr", location: "Remoto", seniority: "Junior", description: "React, TypeScript, Node.js, Tailwind, PostgreSQL, Git." },
  { id: 4, company: "Interbank", position: "Practicante Data Engineer", location: "Lima, Perú", seniority: "Practicante", description: "Python, SQL, PostgreSQL, Airflow, Docker, GCP." },
  { id: 5, company: "Yape", position: "Frontend Developer Trainee", location: "Lima, Híbrido", seniority: "Practicante", description: "React, Next.js, TypeScript, Tailwind CSS, Git." },
  { id: 6, company: "NTT Data", position: "Practicante Machine Learning", location: "Lima, Perú", seniority: "Practicante", description: "Python, Pandas, TensorFlow, SQL, AWS, Docker." },
  { id: 7, company: "Belcorp", position: "Backend Java Semi Senior", location: "Remoto", seniority: "Semi Senior", description: "Java, Spring Boot, REST APIs, Kubernetes, Docker, AWS." },
  { id: 8, company: "Fintech Startup", position: "Full Stack Node + React", location: "Remoto", seniority: "Junior", description: "Node.js, JavaScript, TypeScript, React, MongoDB, REST." },
  { id: 9, company: "Globant", position: "Practicante DevOps", location: "Lima, Remoto", seniority: "Practicante", description: "Linux, Docker, Kubernetes, AWS, Git, GitHub." },
  { id: 10, company: "Alicorp", position: "Data Analyst Junior", location: "Lima, Perú", seniority: "Junior", description: "SQL, Power BI, Excel, Python, MySQL." }
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
  { id: 15, slug: "pandas", name: "Pandas", category: "framework" }
];

function extractSkills(text: string, skills: any[]): string[] {
  if (!text || !skills) return [];
  const lower = " " + text.toLowerCase() + " ";
  const found = new Set<string>();
  for (const s of skills) {
    if (!s || !s.name || !s.slug) continue;
    const names = [s.name, ...(s.aliases ?? [])];
    for (const n of names) {
      if (!n) continue;
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
  if (!jobs || !skills || jobs.length === 0 || skills.length === 0) return [];
  const counts = new Map<string, number>();
  for (const j of jobs) {
    const text = `${j.position || ""} ${j.description || ""}`;
    for (const slug of extractSkills(text, skills)) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  const total = jobs.length;
  if (total === 0) return [];

  const items = [...counts.entries()]
    .map(([slug, count]) => {
      const s = skills.find((x) => x.slug === slug);
      if (!s) return null;
      return { skillId: slug, name: s.name, category: s.category, count, frequency: count / total };
    })
    .filter(Boolean) as any[];

  return items.sort((a, b) => b.count - a.count);
}

export default function LandingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [jobsData, skillsData] = await Promise.all([
          getCatalogJobs(),
          getCatalogSkills()
        ]);
        if (jobsData && jobsData.length > 0) setJobs(jobsData);
        if (skillsData && skillsData.length > 0) setSkills(skillsData);
      } catch (err) {
        console.error("Error cargando landing data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeJobs = jobs.length > 0 ? jobs : DEFAULT_JOBS;
  const activeSkills = skills.length > 0 ? skills : DEFAULT_SKILLS;
  const topSkills = computeMarketSkillFrequency(activeJobs, activeSkills).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 10%, oklch(0.85 0.12 255 / 0.35), transparent 60%), radial-gradient(50% 40% at 85% 15%, oklch(0.85 0.13 180 / 0.35), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 rounded-full border border-outline-variant/60 bg-surface px-3 py-1 text-xs font-medium">
              Para practicantes de últimos ciclos
            </Badge>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl text-on-surface">
              Aprende lo que el mercado tech <span className="gradient-text">realmente pide.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-on-surface-variant">
              SmartPath analiza ofertas laborales tech en Perú, detecta las habilidades más demandadas
              y arma un roadmap priorizado para que llegues listo a tu próxima entrevista.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full px-6 bg-primary text-white hover:bg-primary/90 text-sm font-semibold">
                Empezar gratis
              </Link>
              <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-full px-6 border border-outline-variant text-on-surface hover:bg-surface-container-low bg-white text-sm font-semibold">
                Ver demo del dashboard
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-on-surface-variant">
              <span>📊 {activeJobs.length} ofertas analizadas</span>
              <span>·</span>
              <span>🎯 {topSkills.length}+ skills mapeadas</span>
              <span>·</span>
              <span>🇵🇪 Mercado peruano</span>
            </div>
          </div>

          {/* skills preview */}
          <div className="mt-16 surface-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
                Top skills demandadas ahora mismo
              </h3>
              <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
                Ver todo →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((s: any) => (
                <div key={s.skillId} className="rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm">
                  <span className="font-medium text-on-surface">{s.name}</span>
                  <span className="ml-2 text-xs text-on-surface-variant">{Math.round(s.frequency * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl text-on-surface">Cómo funciona</h2>
          <p className="mt-3 text-on-surface-variant">Cuatro pasos, cero fricción.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Registra tu perfil", d: "Tu carrera, ciclo, skills actuales y objetivo profesional." },
            { n: "02", t: "Analizamos el mercado", d: "Extraemos las tecnologías más pedidas en ofertas reales." },
            { n: "03", t: "Detectamos tu brecha", d: "Comparamos tus skills vs. lo que exige tu rol objetivo." },
            { n: "04", t: "Roadmap + cursos", d: "Un plan priorizado con cursos concretos para cada skill." },
          ].map((step) => (
            <div key={step.n} className="surface-card p-6">
              <div className="font-display text-3xl font-bold gradient-text">{step.n}</div>
              <h3 className="mt-3 text-lg font-semibold text-on-surface">{step.t}</h3>
              <p className="mt-2 text-sm text-on-surface-variant">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="surface-card gradient-brand p-10 text-center text-white shadow-xl">
          <h2 className="font-display text-3xl font-bold">Tu próximo trabajo tech empieza por saber qué aprender.</h2>
          <p className="mt-3 text-white/85">Empieza tu roadmap en menos de 2 minutos.</p>
          <Link href="/login" className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-primary hover:bg-white/90 text-sm font-semibold shadow-md">
            Crear mi perfil
          </Link>
        </div>
      </section>

      {/* Landing Footer Brand Image with Depth Gradient */}
      <section className="relative w-full overflow-hidden bg-white pt-6 pb-12">
        <div className="relative mx-auto max-w-5xl px-6 flex items-center justify-center">
          <div className="relative w-full flex items-center justify-center py-4">
            <img
              src="/img/logo.png"
              alt="SmartPath Brand Logo"
              className="w-full max-w-3xl h-auto max-h-48 md:max-h-64 object-contain opacity-95"
            />
            {/* Gradientes blanco suave de fondo para integrarse al layout */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
}