"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { defaultProfile, type UserProfile, type LearningPreference, type ExperienceKind } from "@/lib/profile-store";
import { type SkillLevel } from "@/lib/smartpath-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { upsertBackendProfile, getCatalogSkills, getCatalogRoles } from "@/services/api";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { Loader2 } from "lucide-react";

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
  { id: 18, slug: "rest", name: "REST APIs", category: "concept" },
  { id: 19, slug: "gcp", name: "Google Cloud", category: "cloud" },
  { id: 20, slug: "excel", name: "Excel", category: "tool" },
  { id: 21, slug: "tensorflow", name: "TensorFlow", category: "framework" },
  { id: 22, slug: "kubernetes", name: "Kubernetes", category: "tool" }
];

const INTERESTS: { id: string; label: string; emoji: string; roles: string[]; skills: string[] }[] = [
  { id: "backend", label: "Backend / APIs", emoji: "🧱", roles: ["backend", "fullstack"], skills: ["java", "python", "nodejs", "springboot", "sql", "docker", "rest"] },
  { id: "frontend", label: "Frontend / UI", emoji: "🎨", roles: ["frontend", "fullstack"], skills: ["javascript", "typescript", "react", "nextjs", "tailwind"] },
  { id: "data", label: "Datos / Analytics", emoji: "📊", roles: ["data-analyst", "data-engineer"], skills: ["sql", "python", "excel", "powerbi", "pandas"] },
  { id: "ml", label: "Machine Learning / IA", emoji: "🤖", roles: ["ml", "data-engineer"], skills: ["python", "pandas", "tensorflow", "sql"] },
  { id: "cloud", label: "Cloud / DevOps", emoji: "☁️", roles: ["devops", "backend"], skills: ["linux", "docker", "kubernetes", "aws", "gcp", "git"] },
  { id: "mobile", label: "Mobile", emoji: "📱", roles: ["frontend", "fullstack"], skills: ["javascript", "typescript", "react"] },
];

type Msg =
  | { role: "bot"; text: string; id: string }
  | { role: "user"; text: string; id: string };

type Step =
  | "name"
  | "career"
  | "cycle"
  | "interests"
  | "target"
  | "skills"
  | "experience"
  | "learning"
  | "availability"
  | "goal"
  | "confirm"
  | "done";

const STEP_ORDER: Step[] = ["name", "career", "cycle", "interests", "target", "skills", "experience", "learning", "availability", "goal", "confirm", "done"];

export default function OnboardingPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, save, hydrated } = useProfile();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("name");
  const [draft, setDraft] = useState<UserProfile>(defaultProfile);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!session) return;
    async function loadData() {
      try {
        setLoadingData(true);
        const [skillsData, rolesData] = await Promise.all([
          getCatalogSkills(),
          getCatalogRoles()
        ]);
        setSkills(skillsData || []);
        setRoles(rolesData || []);
      } catch (err) {
        console.error("Error al cargar catálogos del onboarding:", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [session]);

  useEffect(() => {
    if (session?.user && !profile?.fullName && session.user.user_metadata?.full_name) {
      setDraft(d => ({ ...d, fullName: session.user.user_metadata.full_name }));
    }
  }, [session, profile]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  useEffect(() => {
    if (!hydrated || started.current) return;
    started.current = true;
    const base = profile ?? defaultProfile;
    setDraft({ ...base, onboardingComplete: false });
    pushBot(`¡Hola! Soy SmartBot 🤖. Voy a hacerte algunas preguntas para armar tu ruta hacia el empleo tech. Toma unos 2 minutos.`);
    setTimeout(() => pushBot("Primero, ¿cómo te llamas?"), 500);
  }, [hydrated]);

  function pushBot(text: string) {
    setMessages((m) => [...m, { role: "bot", text, id: crypto.randomUUID() }]);
  }

  function advance(next: Step) {
    setStep(next);
  }

  function submitName(fullName: string) {
    setMessages((m) => [...m, { role: "user", text: fullName, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, fullName }));
    pushBot(`Gusto en conocerte, **${fullName}**. ¿Qué carrera estudias en la universidad?`);
    advance("career");
  }

  function submitCareer(career: string) {
    setMessages((m) => [...m, { role: "user", text: career, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, career }));
    pushBot(`¡Excelente carrera! ¿En qué ciclo académico te encuentras actualmente?`);
    advance("cycle");
  }

  function submitCycle(cycle: string) {
    setMessages((m) => [...m, { role: "user", text: `${cycle}° ciclo`, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, cycle }));
    pushBot(`¡Avanzando! Ahora selecciona los temas o tecnologías que más te llaman la atención para tu futuro profesional.`);
    advance("interests");
  }

  function submitInterests(ids: string[]) {
    setMessages((m) => [...m, { role: "user", text: `Me interesa: ${ids.map((id) => INTERESTS.find((i) => i.id === id)?.label).join(", ")}`, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, interests: ids }));
    pushBot(`¡Muy buenos intereses! De acuerdo a tus respuestas, ¿cuál es tu rol profesional objetivo?`);
    advance("target");
  }

  function submitTarget(id: string) {
    const activeRoles = roles.length > 0 ? roles : DEFAULT_ROLES;
    const role = activeRoles.find((r) => r.id === id) || activeRoles[0];
    setMessages((m) => [...m, { role: "user", text: `Apunto a: ${role.label}`, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, targetRoleId: id }));
    pushBot(`Genial. Cuéntame ahora qué nivel consideras tener en estas habilidades clave para tu rol objetivo (1 principiante, 5 experto). Si no conoces una tecnología, déjala en 0.`);
    advance("skills");
  }

  function submitSkills(userSkills: { skillId: string; level: SkillLevel }[]) {
    const list = userSkills.filter((s) => s.level > 0);
    setMessages((m) => [...m, { role: "user", text: `Calificadas ${list.length} skills`, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, skills: userSkills }));
    pushBot(`¿Con qué tipo de experiencia o proyectos técnicos cuentas actualmente?`);
    advance("experience");
  }

  function submitExperience(experience: ExperienceKind[]) {
    const labels: Record<ExperienceKind, string> = {
      personal: "Proyectos personales",
      cursos: "Cursos/bootcamps",
      practicas: "Prácticas pre-profesionales",
      laboral: "Experiencia laboral",
      ninguna: "Aún no tengo experiencia",
    };
    setMessages((m) => [...m, { role: "user", text: experience.map((e) => labels[e]).join(", "), id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, experience }));
    pushBot(`¿Cómo prefieres consumir tu material de estudio para aprender una nueva tecnología?`);
    advance("learning");
  }

  function submitLearning(learningPreferences: LearningPreference[]) {
    const labels: Record<LearningPreference, string> = {
      video: "Videos/clases",
      lectura: "Lecturas/docs",
      practica: "Práctica hands-on",
      comunidad: "Comunidad/mentoría",
    };
    setMessages((m) => [...m, { role: "user", text: learningPreferences.map((p) => labels[p]).join(", "), id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, learningPreferences }));
    pushBot(`¿Cuántas horas a la semana puedes dedicarle a tu preparación y estudio técnico?`);
    advance("availability");
  }

  function submitAvailability(availabilityHours: number) {
    setMessages((m) => [...m, { role: "user", text: `${availabilityHours} horas por semana`, id: crypto.randomUUID() }]);
    setDraft((d) => ({ ...d, availabilityHours }));
    pushBot(`Para finalizar, ¿cuál es tu meta profesional y en cuántos meses deseas alcanzarla?`);
    advance("goal");
  }

  function submitGoal(goal: string, targetMonths: number) {
    setMessages((m) => [...m, { role: "user", text: `${goal} (Meta a ${targetMonths} meses)`, id: crypto.randomUUID() }]);
    const final = { ...draft, goal, targetMonths, onboardingComplete: true };
    setDraft(final);
    pushBot(`¡Todo listo! Revisa que tu información esté correcta para generar tu ruta personalizada.`);
    advance("confirm");
  }

  async function confirmAll() {
    const final = { ...draft, onboardingComplete: true };
    save(final);

    if (session?.access_token) {
      try {
        await upsertBackendProfile(session.access_token, final);
        toast.success("Perfil sincronizado con el backend");
      } catch (err) {
        console.error("Error al sincronizar perfil en onboarding:", err);
        toast.warning("Perfil guardado localmente, pero no se pudo sincronizar con el backend");
      }
    }

    const activeRoles = roles.length > 0 ? roles : DEFAULT_ROLES;
    const role = activeRoles.find((r) => r.id === final.targetRoleId) || activeRoles[0];
    pushBot(`🎉 ¡Perfecto! Hemos completado tu ruta para **${role.label}**. Redirigiendo a tu dashboard...`);
    advance("done");
    toast.success(`Ruta lista para ${role.label}`);
    setTimeout(() => router.push("/dashboard"), 1600);
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progress = ((STEP_ORDER.indexOf(step) + 1) / (STEP_ORDER.length - 1)) * 100;

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-6 md:py-10">
      <header className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Construyendo tu perfil</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full gradient-brand transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
      </header>

      <div className="surface-card flex h-[calc(100vh-14rem)] min-h-[500px] flex-col overflow-hidden bg-white">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-outline-variant px-5 py-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm">
            <img src="/favicon.png" alt="SmartBot Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="text-sm font-semibold text-on-surface">SmartBot</div>
            <div className="text-xs text-success-foreground">● En línea</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
          {messages.map((m) => (
            <MessageBubble key={m.id} m={m} />
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-outline-variant bg-surface-container-low p-4">
          <StepInput
            step={step}
            draft={draft}
            roles={roles}
            skills={skills}
            onName={submitName}
            onCareer={submitCareer}
            onCycle={submitCycle}
            onInterests={submitInterests}
            onTarget={submitTarget}
            onSkills={submitSkills}
            onExperience={submitExperience}
            onLearning={submitLearning}
            onAvailability={submitAvailability}
            onGoal={submitGoal}
            onConfirm={confirmAll}
          />
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-on-surface-variant">
        ¿Prefieres el formulario tradicional? <Link href="/perfil" className="text-primary hover:underline">Ir a Perfil</Link>
      </p>
    </div>
  );
}

function MessageBubble({ m }: { m: Msg }) {
  if (m.role === "bot") {
    return (
      <div className="flex items-start gap-2">
        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white p-1 border border-slate-200 shadow-sm">
          <img src="/favicon.png" alt="SmartBot Logo" className="h-full w-full object-contain" />
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-surface-container-high px-4 py-2.5 text-sm leading-relaxed text-on-surface">
          {m.text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
            p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm gradient-brand px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
        {m.text}
      </div>
    </div>
  );
}

interface StepInputProps {
  step: Step;
  draft: UserProfile;
  roles: any[];
  skills: any[];
  onName: (v: string) => void;
  onCareer: (v: string) => void;
  onCycle: (v: string) => void;
  onInterests: (ids: string[]) => void;
  onTarget: (id: string) => void;
  onSkills: (l: { skillId: string; level: SkillLevel }[]) => void;
  onExperience: (e: ExperienceKind[]) => void;
  onLearning: (p: LearningPreference[]) => void;
  onAvailability: (h: number) => void;
  onGoal: (goal: string, months: number) => void;
  onConfirm: () => void;
}

function StepInput(p: StepInputProps) {
  switch (p.step) {
    case "name":
      return (
        <TextComposer
          placeholder="Tu nombre completo"
          defaultValue={p.draft.fullName}
          onSubmit={p.onName}
        />
      );
    case "career":
      return (
        <TextComposer
          placeholder="Ej: Ingeniería de Sistemas, Ciencia de la Computación"
          defaultValue={p.draft.career}
          onSubmit={p.onCareer}
        />
      );
    case "cycle":
      return (
        <ChipRow
          options={[
            { id: "7", label: "7° ciclo" },
            { id: "8", label: "8° ciclo" },
            { id: "9", label: "9° ciclo" },
            { id: "10", label: "10° ciclo" },
            { id: "egresado", label: "Egresado" },
          ]}
          onSelect={p.onCycle}
        />
      );
    case "interests":
      return (
        <MultiChip
          options={INTERESTS.map((i) => ({ id: i.id, label: `${i.emoji} ${i.label}` }))}
          initial={p.draft.interests}
          onSubmit={p.onInterests}
        />
      );
    case "target": {
      const activeRoles = p.roles && p.roles.length > 0 ? p.roles : DEFAULT_ROLES;
      return (
        <TargetRolePicker
          activeRoles={activeRoles}
          draftInterests={p.draft.interests}
          onTarget={p.onTarget}
        />
      );
    }
    case "skills": {
      const activeRoles = p.roles && p.roles.length > 0 ? p.roles : DEFAULT_ROLES;
      const interestSkills = new Set<string>();
      p.draft.interests.forEach((iid) => INTERESTS.find((i) => i.id === iid)?.skills.forEach((s) => interestSkills.add(s)));
      const role = activeRoles.find((r) => r.id === p.draft.targetRoleId);
      if (role && (role.core_skill_slugs || role.coreSkills)) {
        const slugs = role.core_skill_slugs || role.coreSkills;
        slugs.forEach((s: any) => interestSkills.add(s));
      }
      return <SkillsPicker skillIds={[...interestSkills]} initial={p.draft.skills} onSubmit={p.onSkills} skillsList={p.skills} />;
    }
    case "experience":
      return (
        <MultiChip
          options={[
            { id: "personal", label: "🧪 Proyectos personales" },
            { id: "cursos", label: "🎓 Cursos / bootcamps" },
            { id: "practicas", label: "💼 Prácticas pre-profesionales" },
            { id: "laboral", label: "🏢 Experiencia laboral" },
            { id: "ninguna", label: "🌱 Aún no tengo" },
          ]}
          initial={p.draft.experience}
          onSubmit={(ids) => p.onExperience(ids as ExperienceKind[])}
        />
      );
    case "learning":
      return (
        <MultiChip
          options={[
            { id: "video", label: "📺 Videos / clases" },
            { id: "lectura", label: "📖 Lectura / docs" },
            { id: "practica", label: "🛠️ Práctica hands-on" },
            { id: "comunidad", label: "👥 Comunidad / mentoría" },
          ]}
          initial={p.draft.learningPreferences}
          onSubmit={(ids) => p.onLearning(ids as LearningPreference[])}
        />
      );
    case "availability":
      return <AvailabilityPicker initial={p.draft.availabilityHours} onSubmit={p.onAvailability} />;
    case "goal":
      return (
        <GoalComposer
          defaultGoal={p.draft.goal}
          defaultMonths={p.draft.targetMonths || 6}
          onSubmit={p.onGoal}
        />
      );
    case "confirm":
      return <ConfirmPanel draft={p.draft} onConfirm={p.onConfirm} roles={p.roles} />;
    case "done":
      return <div className="text-center text-sm text-on-surface-variant">Preparando tu roadmap...</div>;
  }
}

function TargetRolePicker({
  activeRoles,
  draftInterests,
  onTarget,
}: {
  activeRoles: any[];
  draftInterests: string[];
  onTarget: (id: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const suggestedIds = new Set<string>();
  draftInterests.forEach((iid) => INTERESTS.find((i) => i.id === iid)?.roles.forEach((r) => suggestedIds.add(r)));
  const suggestedRoles = activeRoles.filter((r) => suggestedIds.has(r.id));
  const hasMore = suggestedRoles.length > 0 && suggestedRoles.length < activeRoles.length;
  const list = showAll || !suggestedRoles.length ? activeRoles : suggestedRoles;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {list.map((r) => (
        <button
          key={r.id}
          onClick={() => onTarget(r.id)}
          className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/5 text-on-surface"
        >
          {r.label}
        </button>
      ))}
      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="rounded-full border border-dashed border-primary/60 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          🔍 Ver otros roles ({activeRoles.length - suggestedRoles.length} más)
        </button>
      )}
    </div>
  );
}

function TextComposer({ placeholder, defaultValue, onSubmit }: { placeholder: string; defaultValue?: string; onSubmit: (v: string) => void }) {
  const [v, setV] = useState(defaultValue || "");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); setV(""); }} className="flex gap-2">
      <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} autoFocus className="flex-1 bg-white" />
      <Button type="submit" className="gradient-brand text-white hover:opacity-90">Enviar</Button>
    </form>
  );
}

function ChipRow({ options, onSelect }: { options: { id: string; label: string }[]; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/5 text-on-surface"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MultiChip({
  options,
  initial,
  onSubmit,
}: {
  options: { id: string; label: string }[];
  initial: string[];
  onSubmit: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.id);
          return (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active ? "border-primary bg-primary text-white" : "border-outline-variant bg-white text-on-surface hover:border-primary"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(selected)} disabled={selected.length === 0} className="gradient-brand text-white hover:opacity-90">
          Continuar
        </Button>
      </div>
    </div>
  );
}

function SkillsPicker({
  skillIds,
  initial,
  onSubmit,
  skillsList,
}: {
  skillIds: string[];
  initial: { skillId: string; level: SkillLevel }[];
  onSubmit: (l: { skillId: string; level: SkillLevel }[]) => void;
  skillsList: any[];
}) {
  const [levels, setLevels] = useState<Record<string, SkillLevel | 0>>(() => {
    const m: Record<string, SkillLevel | 0> = {};
    skillIds.forEach((id) => {
      const found = initial.find((s) => s.skillId === id);
      m[id] = found?.level ?? 0;
    });
    return m;
  });

  const activeSkillsList = skillsList && skillsList.length > 0 ? skillsList : DEFAULT_SKILLS;
  const filteredSkills = skillIds
    .map((id) => {
      const found = activeSkillsList.find((s) => s.slug === id || s.id === id);
      if (found) return found;
      const fallback = DEFAULT_SKILLS.find((s) => s.slug === id);
      if (fallback) return fallback;
      return { slug: id, name: id.charAt(0).toUpperCase() + id.slice(1) };
    })
    .filter(Boolean);

  return (
    <div>
      <div className="mb-3 max-h-56 overflow-y-auto rounded-lg border border-outline-variant bg-white p-2">
        {filteredSkills.map((s) => (
          <div key={s.slug} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-surface-container-low">
            <span className="text-sm font-medium text-on-surface">{s.name}</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevels((m) => ({ ...m, [s.slug]: lvl as SkillLevel | 0 }))}
                  className={`h-6 w-6 rounded text-xs font-semibold transition ${
                    (levels[s.slug] ?? 0) === lvl
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                  type="button"
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            const arr = Object.entries(levels)
              .filter(([_, lvl]) => lvl > 0)
              .map(([skillId, level]) => ({ skillId, level: level as SkillLevel }));
            onSubmit(arr);
          }}
          className="gradient-brand text-white hover:opacity-90"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

function AvailabilityPicker({ initial, onSubmit }: { initial: number; onSubmit: (h: number) => void }) {
  const [h, setH] = useState(initial || 10);
  const presetOptions = [5, 10, 15, 20];

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Selección rápida
        </label>
        <div className="flex items-center gap-2">
          {presetOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setH(opt)}
              className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition ${
                h === opt
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-outline-variant bg-white text-on-surface hover:border-primary/60 hover:bg-primary/5"
              }`}
            >
              {opt === 20 ? "20+" : opt}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-white p-3 shadow-xs">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-on-surface-variant">Horas dedicadas</span>
          <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
            {h} horas / semana
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={40}
          step={1}
          value={h}
          onChange={(e) => setH(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-900 shadow-xs">
        <span className="text-base">💡</span>
        <span>
          <strong>Sé realista</strong>, así te recomendaremos la mejor ruta para ti.
        </span>
      </div>

      <div className="flex justify-end pt-1">
        <Button onClick={() => onSubmit(h)} className="gradient-brand text-white hover:opacity-90">
          Continuar
        </Button>
      </div>
    </div>
  );
}

function GoalComposer({
  defaultGoal,
  defaultMonths,
  onSubmit,
}: {
  defaultGoal: string;
  defaultMonths: number;
  onSubmit: (goal: string, months: number) => void;
}) {
  const [goal, setGoal] = useState(defaultGoal || "");
  const [months, setMonths] = useState(defaultMonths || 6);

  const monthOptions = [
    { value: 3, label: "3 meses", desc: "Intensivo" },
    { value: 6, label: "6 meses", desc: "Recomendado" },
    { value: 12, label: "12 meses", desc: "Flexible" },
  ];

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          ¿En qué tiempo esperas lograr tu meta?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {monthOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMonths(opt.value)}
              className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition ${
                months === opt.value
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                  : "border-outline-variant bg-white text-on-surface hover:border-primary/60"
              }`}
            >
              <span className="text-sm font-semibold">{opt.label}</span>
              <span className="text-[10px] text-on-surface-variant">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (goal.trim()) onSubmit(goal, months);
        }}
        className="flex gap-2"
      >
        <Input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Ej: conseguir mi primera práctica como Frontend en una fintech"
          className="flex-1 bg-white"
          autoFocus
        />
        <Button type="submit" disabled={!goal.trim()} className="gradient-brand text-white hover:opacity-90">
          Enviar
        </Button>
      </form>
    </div>
  );
}

function ConfirmPanel({ draft, onConfirm, roles }: { draft: UserProfile; onConfirm: () => void; roles: any[] }) {
  const activeRoles = roles && roles.length > 0 ? roles : DEFAULT_ROLES;
  const role = activeRoles.find((r) => r.id === draft.targetRoleId);

  const preferenceLabels: Record<string, string> = {
    video: "Videos 📺",
    lectura: "Lectura 📖",
    practica: "Práctica 🛠️",
    comunidad: "Comunidad 👥",
  };

  const selectedPrefs = (draft.learningPreferences || [])
    .map((p) => preferenceLabels[p] || p)
    .join(", ");

  return (
    <div className="space-y-3 text-sm text-on-surface">
      <div className="grid gap-2 rounded-xl border border-outline-variant bg-white p-3.5 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nombre</span>
          <span className="text-right text-sm font-medium">{draft.fullName || "—"}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Carrera</span>
          <span className="text-right text-sm font-medium">{`${draft.career} · ${draft.cycle}° ciclo`}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Rol Objetivo</span>
          <span className="text-right text-sm font-medium">{role?.label ?? ""}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Estilo de Estudio</span>
          <span className="text-right text-sm font-medium">{selectedPrefs || "No especificado"}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Disponibilidad</span>
          <span className="text-right text-sm font-medium">{`${draft.availabilityHours}h / semana`}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Plazo Objetivo</span>
          <span className="text-right text-sm font-medium">{`${draft.targetMonths || 6} meses`}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Meta Profesional</span>
          <span className="text-right text-sm font-medium">{draft.goal || "—"}</span>
        </div>
      </div>
      <div className="flex justify-end pt-1">
        <Button onClick={onConfirm} size="lg" className="gradient-brand text-white hover:opacity-90">
          Generar mi ruta 🚀
        </Button>
      </div>
    </div>
  );
}
