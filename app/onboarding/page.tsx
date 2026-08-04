"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { defaultProfile, type UserProfile, type LearningPreference, type ExperienceKind } from "@/lib/profile-store";
import { type SkillLevel } from "@/lib/smartpath-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  upsertBackendProfile,
  getCatalogSkills,
  getCatalogRoles,
  startOnboarding,
  saveOnboardingName,
  saveOnboardingCareer,
  saveOnboardingStage,
  saveOnboardingInterests,
  saveOnboardingTargetRole,
  getOnboardingInterestAreas,
  type OnboardingOption,
  type OnboardingStepResponse,
} from "@/services/api";
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

/**
 * Skills que proponemos calificar según las áreas que el usuario eligió en la
 * HU-30. Las claves son los ids que devuelve GET /onboarding/interest-areas.
 */
const INTEREST_SKILL_HINTS: Record<string, string[]> = {
  "data-analytics": ["sql", "python", "excel", "powerbi", "pandas"],
  frontend: ["javascript", "typescript", "react", "nextjs", "tailwind"],
  backend: ["java", "python", "nodejs", "springboot", "sql", "docker", "rest"],
  "cloud-devops": ["linux", "docker", "kubernetes", "aws", "gcp", "git"],
  "machine-learning": ["python", "pandas", "tensorflow", "sql"],
  cybersecurity: ["linux", "python", "docker", "git", "aws"],
};

const INTEREST_EMOJIS: Record<string, string> = {
  "data-analytics": "📊",
  frontend: "🎨",
  backend: "🧱",
  "cloud-devops": "☁️",
  "machine-learning": "🤖",
  cybersecurity: "🔐",
};

type Msg =
  | { role: "bot"; text: string; id: string }
  | { role: "user"; text: string; id: string };

/**
 * Los cinco primeros pasos los conduce el chatbot del backend (HU-29 a HU-31)
 * y sus ids vienen en el campo `step` de la respuesta. Los siguientes son
 * locales: todavía no existe un endpoint de onboarding para ellos.
 */
type Step =
  | "loading"
  | "ask_name"
  | "ask_career"
  | "ask_cycle"
  | "ask_interests"
  | "ask_target_role"
  | "skills"
  | "experience"
  | "learning"
  | "availability"
  | "goal"
  | "confirm"
  | "done";

const STEP_ORDER: Step[] = [
  "ask_name",
  "ask_career",
  "ask_cycle",
  "ask_interests",
  "ask_target_role",
  "skills",
  "experience",
  "learning",
  "availability",
  "goal",
  "confirm",
  "done",
];

/** Vuelca el perfil que devuelve el backend sobre el borrador local. */
function mergeBackendProfile(current: UserProfile, p: any): UserProfile {
  if (!p) return current;

  return {
    ...current,
    fullName: p.full_name ?? current.fullName,
    email: p.email ?? current.email,
    career: p.career ?? current.career,
    university: p.university ?? current.university,
    cycle: p.academic_cycle != null ? String(p.academic_cycle) : current.cycle,
    // El chatbot marca al egresado escribiendo "Egresado" en experience_level.
    isGraduated: p.experience_level === "Egresado",
    interests: p.interests ?? current.interests,
    targetRoleId: p.target_role_id ?? current.targetRoleId,
    availabilityHours: p.weekly_hours ?? current.availabilityHours,
    learningPreferences: p.learning_preferences ?? current.learningPreferences,
    skills: p.skills?.length
      ? p.skills.map((s: any) => ({ skillId: s.skill_slug, level: s.level as SkillLevel }))
      : current.skills,
    // `goal` no se hidrata desde professional_goal: tras la HU-31 ese campo
    // guarda la etiqueta del rol objetivo, no la meta que escribe el usuario.
  };
}

export default function OnboardingPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, save, hydrated } = useProfile();
  const router = useRouter();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("loading");
  const [draft, setDraft] = useState<UserProfile>(defaultProfile);
  const [options, setOptions] = useState<OnboardingOption[]>([]);
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const token = session?.access_token as string | undefined;

  useEffect(() => {
    if (!session) return;
    async function loadData() {
      try {
        const [skillsData, rolesData] = await Promise.all([
          getCatalogSkills().catch(() => []),
          getCatalogRoles().catch(() => []),
        ]);
        setSkills(skillsData || []);
        setRoles(rolesData || []);
      } catch (err) {
        console.error("Error al cargar catálogos del onboarding:", err);
      }
    }
    loadData();
  }, [session]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  function pushBot(text: string) {
    setMessages((m) => [...m, { role: "bot", text, id: crypto.randomUUID() }]);
  }

  function pushUser(text: string) {
    setMessages((m) => [...m, { role: "user", text, id: crypto.randomUUID() }]);
  }

  /** Pinta lo que respondió el chatbot y deja el formulario del paso que toca. */
  const applyStep = useCallback((res: OnboardingStepResponse) => {
    setDraft((d) => mergeBackendProfile(d, res.profile));
    setOptions(res.options ?? []);
    pushBot(res.message);
    if (res.question) pushBot(res.question);

    if (res.step === "completed") {
      // El backend ya tiene todo lo suyo; seguimos con los pasos locales.
      pushBot(
        "Para afinar tu ruta, cuéntame qué nivel consideras tener en estas habilidades clave (1 principiante, 5 experto). Si no conoces una, déjala en 0."
      );
      setStep("skills");
      return;
    }

    setStep(res.step);
  }, []);

  // Arranca (o retoma) la conversación con el backend.
  useEffect(() => {
    if (!hydrated || !token || started.current) return;
    started.current = true;

    async function bootstrap() {
      setDraft({ ...(profile ?? defaultProfile), onboardingComplete: false });
      try {
        applyStep(await startOnboarding(token!));
      } catch (err) {
        console.error("Error al iniciar el onboarding:", err);
        pushBot("No pude conectarme con SmartPath para iniciar tu onboarding. Revisa tu conexión y recarga la página.");
        toast.error("No se pudo conectar con el servidor");
        setStep("ask_name");
      }
    }
    bootstrap();
  }, [hydrated, token, profile, applyStep]);

  /** Envía la respuesta del usuario al chatbot y aplica el paso resultante. */
  async function runStep(userText: string, action: () => Promise<OnboardingStepResponse>) {
    if (sending) return;
    pushUser(userText);
    setSending(true);
    try {
      applyStep(await action());
    } catch (err) {
      console.error("Error al guardar el paso del onboarding:", err);
      // Mantenemos el paso actual para que pueda reintentar sin perder el hilo.
      pushBot("No pude guardar tu respuesta. ¿Lo intentamos otra vez?");
      toast.error("No se pudo guardar tu respuesta");
    } finally {
      setSending(false);
    }
  }

  // ---- Pasos conducidos por el backend (HU-29, HU-30, HU-31) ----

  function submitName(fullName: string) {
    runStep(fullName, () => saveOnboardingName(token!, fullName));
  }

  function submitCareer(career: string) {
    runStep(career, () => saveOnboardingCareer(token!, career));
  }

  function submitStage(value: string) {
    if (value === "egresado") {
      runStep("Ya egresé", () => saveOnboardingStage(token!, { isGraduated: true }));
      return;
    }
    const cycle = Number(value);
    runStep(`Ciclo ${cycle}`, () => saveOnboardingStage(token!, { academicCycle: cycle }));
  }

  function submitInterests(ids: string[]) {
    const labels = ids.map((id) => options.find((o) => o.id === id)?.label ?? id).join(", ");
    runStep(`Me interesa: ${labels}`, () => saveOnboardingInterests(token!, ids));
  }

  function submitTarget(id: string) {
    const label = options.find((o) => o.id === id)?.label ?? roles.find((r) => r.id === id)?.label ?? id;
    runStep(`Apunto a: ${label}`, () => saveOnboardingTargetRole(token!, id));
  }

  // ---- Pasos locales (sin endpoint propio todavía) ----

  function submitSkills(userSkills: { skillId: string; level: SkillLevel }[]) {
    const list = userSkills.filter((s) => s.level > 0);
    pushUser(`Calificadas ${list.length} skills`);
    setDraft((d) => ({ ...d, skills: userSkills }));
    pushBot("¿Con qué tipo de experiencia o proyectos técnicos cuentas actualmente?");
    setStep("experience");
  }

  function submitExperience(experience: ExperienceKind[]) {
    const labels: Record<ExperienceKind, string> = {
      personal: "Proyectos personales",
      cursos: "Cursos/bootcamps",
      practicas: "Prácticas pre-profesionales",
      laboral: "Experiencia laboral",
      ninguna: "Aún no tengo experiencia",
    };
    pushUser(experience.map((e) => labels[e]).join(", "));
    setDraft((d) => ({ ...d, experience }));
    pushBot("¿Cómo prefieres consumir tu material de estudio para aprender una nueva tecnología?");
    setStep("learning");
  }

  function submitLearning(learningPreferences: LearningPreference[]) {
    const labels: Record<LearningPreference, string> = {
      video: "Videos/clases",
      lectura: "Lecturas/docs",
      practica: "Práctica hands-on",
      comunidad: "Comunidad/mentoría",
    };
    pushUser(learningPreferences.map((p) => labels[p]).join(", "));
    setDraft((d) => ({ ...d, learningPreferences }));
    pushBot("¿Cuántas horas a la semana puedes dedicarle a tu preparación y estudio técnico?");
    setStep("availability");
  }

  function submitAvailability(availabilityHours: number) {
    pushUser(`${availabilityHours} horas semanales`);
    setDraft((d) => ({ ...d, availabilityHours }));
    pushBot("Para finalizar, ¿cuál es tu principal meta a corto plazo? (Ej: conseguir mis primeras prácticas en una fintech).");
    setStep("goal");
  }

  function submitGoal(goal: string) {
    pushUser(goal);
    setDraft((d) => ({ ...d, goal, onboardingComplete: true }));
    pushBot("¡Todo listo! Revisa que tu información esté correcta para generar tu ruta personalizada.");
    setStep("confirm");
  }

  async function confirmAll() {
    const final = { ...draft, onboardingComplete: true };
    save(final);

    if (token) {
      try {
        await upsertBackendProfile(token, final);
        toast.success("Perfil sincronizado con el backend");
      } catch (err) {
        console.error("Error al sincronizar perfil en onboarding:", err);
        toast.warning("Perfil guardado localmente, pero no se pudo sincronizar con el backend");
      }
    }

    const activeRoles = roles.length > 0 ? roles : DEFAULT_ROLES;
    const role = activeRoles.find((r) => r.id === final.targetRoleId) || activeRoles[0];
    pushBot(`🎉 ¡Perfecto! Hemos completado tu ruta para **${role.label}**. Redirigiendo a tu dashboard...`);
    setStep("done");
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

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = stepIndex < 0 ? 0 : ((stepIndex + 1) / (STEP_ORDER.length - 1)) * 100;

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
          {sending && (
            <div className="flex items-center gap-2 pl-9 text-xs text-on-surface-variant">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              SmartBot está escribiendo...
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-outline-variant bg-surface-container-low p-4">
          <StepInput
            step={step}
            draft={draft}
            options={options}
            roles={roles}
            skills={skills}
            disabled={sending}
            onName={submitName}
            onCareer={submitCareer}
            onStage={submitStage}
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
  options: OnboardingOption[];
  roles: any[];
  skills: any[];
  disabled: boolean;
  onName: (v: string) => void;
  onCareer: (v: string) => void;
  onStage: (v: string) => void;
  onInterests: (ids: string[]) => void;
  onTarget: (id: string) => void;
  onSkills: (l: { skillId: string; level: SkillLevel }[]) => void;
  onExperience: (e: ExperienceKind[]) => void;
  onLearning: (p: LearningPreference[]) => void;
  onAvailability: (h: number) => void;
  onGoal: (v: string) => void;
  onConfirm: () => void;
}

function StepInput(p: StepInputProps) {
  switch (p.step) {
    case "loading":
      return (
        <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
          <Loader2 className="h-4 w-4 animate-spin" /> Conectando con SmartBot...
        </div>
      );
    case "ask_name":
      return (
        <TextComposer
          placeholder="Tu nombre completo"
          defaultValue={p.draft.fullName}
          disabled={p.disabled}
          onSubmit={p.onName}
        />
      );
    case "ask_career":
      return (
        <TextComposer
          placeholder="Ej: Ingeniería de Sistemas, Ciencia de la Computación"
          defaultValue={p.draft.career}
          disabled={p.disabled}
          onSubmit={p.onCareer}
        />
      );
    case "ask_cycle":
      return <CyclePicker disabled={p.disabled} onSelect={p.onStage} />;
    case "ask_interests":
      return <InterestPicker options={p.options} initial={p.draft.interests} disabled={p.disabled} onSubmit={p.onInterests} />;
    case "ask_target_role":
      return <TargetRolePicker suggestions={p.options} allRoles={p.roles} disabled={p.disabled} onTarget={p.onTarget} />;
    case "skills": {
      const activeRoles = p.roles && p.roles.length > 0 ? p.roles : DEFAULT_ROLES;
      const interestSkills = new Set<string>();
      p.draft.interests.forEach((id) => INTEREST_SKILL_HINTS[id]?.forEach((s) => interestSkills.add(s)));
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
        <TextComposer
          placeholder="Ej: conseguir mi primera práctica como Frontend en una fintech"
          defaultValue={p.draft.goal}
          onSubmit={p.onGoal}
        />
      );
    case "confirm":
      return <ConfirmPanel draft={p.draft} onConfirm={p.onConfirm} roles={p.roles} />;
    case "done":
      return <div className="text-center text-sm text-on-surface-variant">Preparando tu roadmap...</div>;
  }
}

/** HU-29: el backend acepta ciclos de 1 a 12, o la marca de egresado. */
function CyclePicker({ disabled, onSelect }: { disabled: boolean; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
        <button
          key={c}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(String(c))}
          className="h-9 w-11 rounded-full border border-outline-variant bg-white text-sm font-medium text-on-surface transition hover:border-primary hover:bg-primary/5 disabled:opacity-50"
        >
          {c}°
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("egresado")}
        className="h-9 rounded-full border border-outline-variant bg-white px-4 text-sm font-medium text-on-surface transition hover:border-primary hover:bg-primary/5 disabled:opacity-50"
      >
        🎓 Ya egresé
      </button>
    </div>
  );
}

/** HU-30: áreas de tecnología servidas por el backend. */
function InterestPicker({
  options,
  initial,
  disabled,
  onSubmit,
}: {
  options: OnboardingOption[];
  initial: string[];
  disabled: boolean;
  onSubmit: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [areas, setAreas] = useState<OnboardingOption[]>(options);

  // Red de seguridad: si el paso llegó sin opciones, las pedimos al catálogo.
  useEffect(() => {
    if (options.length > 0) {
      setAreas(options);
      return;
    }
    getOnboardingInterestAreas()
      .then(setAreas)
      .catch((err) => console.error("Error al cargar las áreas de interés:", err));
  }, [options]);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {areas.map((a) => {
          const active = selected.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              title={a.description}
              onClick={() => toggle(a.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active ? "border-primary bg-primary text-white" : "border-outline-variant bg-white text-on-surface hover:border-primary"
              }`}
            >
              {INTEREST_EMOJIS[a.id] ? `${INTEREST_EMOJIS[a.id]} ` : ""}
              {a.label}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => onSubmit(selected)}
          disabled={disabled || selected.length === 0}
          className="gradient-brand text-white hover:opacity-90"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

/**
 * HU-31: muestra las líneas de carrera que sugirió el backend según los
 * intereses, con la opción de ver el catálogo completo de role_targets.
 */
function TargetRolePicker({
  suggestions,
  allRoles,
  disabled,
  onTarget,
}: {
  suggestions: OnboardingOption[];
  allRoles: any[];
  disabled: boolean;
  onTarget: (id: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const catalog = allRoles && allRoles.length > 0 ? allRoles : DEFAULT_ROLES;
  const list = showAll || suggestions.length === 0 ? catalog : suggestions;
  const hasMore = suggestions.length > 0 && suggestions.length < catalog.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {list.map((r: any) => (
        <button
          key={r.id}
          type="button"
          disabled={disabled}
          onClick={() => onTarget(r.id)}
          className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-medium transition hover:border-primary hover:bg-primary/5 text-on-surface disabled:opacity-50"
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
          🔍 Ver otros roles ({catalog.length - suggestions.length} más)
        </button>
      )}
    </div>
  );
}

function TextComposer({
  placeholder,
  defaultValue,
  disabled,
  onSubmit,
}: {
  placeholder: string;
  defaultValue?: string;
  disabled?: boolean;
  onSubmit: (v: string) => void;
}) {
  const [v, setV] = useState(defaultValue || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.trim()) return;
        onSubmit(v.trim());
        setV("");
      }}
      className="flex gap-2"
    >
      <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} autoFocus disabled={disabled} className="flex-1 bg-white" />
      <Button type="submit" disabled={disabled} className="gradient-brand text-white hover:opacity-90">Enviar</Button>
    </form>
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
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-on-surface-variant">Horas por semana</span>
        <span className="text-lg font-bold gradient-text">{h}h</span>
      </div>
      <input
        type="range"
        min={2}
        max={40}
        step={1}
        value={h}
        onChange={(e) => setH(Number(e.target.value))}
        className="mb-3 w-full accent-primary"
      />
      <div className="flex justify-end">
        <Button onClick={() => onSubmit(h)} className="gradient-brand text-white hover:opacity-90">Continuar</Button>
      </div>
    </div>
  );
}

function ConfirmPanel({ draft, onConfirm, roles }: { draft: UserProfile; onConfirm: () => void; roles: any[] }) {
  const activeRoles = roles && roles.length > 0 ? roles : DEFAULT_ROLES;
  const role = activeRoles.find((r) => r.id === draft.targetRoleId);
  const stage = draft.isGraduated ? "Egresado" : `${draft.cycle}° ciclo`;
  return (
    <div className="space-y-2 text-sm text-on-surface">
      <div className="grid gap-1.5 rounded-lg border border-outline-variant bg-white p-3">
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs uppercase tracking-wider text-on-surface-variant">Nombre</span>
          <span className="text-right text-sm font-medium">{draft.fullName || "—"}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs uppercase tracking-wider text-on-surface-variant">Carrera</span>
          <span className="text-right text-sm font-medium">{`${draft.career} · ${stage}`}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs uppercase tracking-wider text-on-surface-variant">Objetivo</span>
          <span className="text-right text-sm font-medium">{role?.label ?? ""}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs uppercase tracking-wider text-on-surface-variant">Habilidades</span>
          <span className="text-right text-sm font-medium">{`${draft.skills.length} registradas`}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs uppercase tracking-wider text-on-surface-variant">Disponibilidad</span>
          <span className="text-right text-sm font-medium">{`${draft.availabilityHours}h / semana`}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="shrink-0 text-xs uppercase tracking-wider text-on-surface-variant">Meta 6m</span>
          <span className="text-right text-sm font-medium">{draft.goal || "—"}</span>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={onConfirm} size="lg" className="gradient-brand text-white hover:opacity-90">
          Generar mi ruta 🚀
        </Button>
      </div>
    </div>
  );
}
