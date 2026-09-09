"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Loader2,
  Lock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { QuizModal } from "@/components/courses/QuizModal";
import { getCourseDetail, getCourseModules, type CatalogCourse } from "@/services/api";

const ASSET_GROUPS: Record<string, string> = {
  aws: "cloud", azure: "cloud", cloud: "cloud",
  docker: "devops", kubernetes: "devops", linux: "devops",
  python: "data", pandas: "data", sql: "data", postgresql: "data", postgres: "data", powerbi: "data",
  tensorflow: "ai", machinelearning: "ai",
  react: "web", nextjs: "web", javascript: "web", typescript: "web", html: "web", css: "web", nodejs: "web",
  android: "mobile", kotlin: "mobile",
  cybersecurity: "cybersecurity",
};

function getAssetGroup(course: CatalogCourse | null) {
  if (!course) return "default";
  const match = course.skill_slugs?.find((slug) => ASSET_GROUPS[slug.toLowerCase()]);
  return match ? ASSET_GROUPS[match.toLowerCase()] : "default";
}

function formatCourseValue(value: string | null | undefined) {
  if (!value) return "Por definir";
  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = {
    free: "Gratis", gratis: "Gratis", "paid course": "De pago", paid: "De pago",
    beginner: "Principiante", basic: "Básico", intermediate: "Intermedio", advanced: "Avanzado",
    spanish: "Español", english: "Inglés",
  };
  return translations[normalized] ?? value;
}

function getModuleStatusLabel(mod: any): string {
  if (!mod.attempts || mod.attempts === 0) return "Módulo pendiente";
  if (mod.passed) return "Módulo completado";
  return "Falta validar";
}

function getModuleStatusStyle(mod: any): string {
  if (!mod.attempts || mod.attempts === 0) return "bg-gray-100 text-gray-600";
  if (mod.passed) return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
}

function isModuleLocked(modulesList: any[], index: number): boolean {
  if (index === 0) return false;
  return !modulesList[index - 1]?.passed;
}

export default function CourseModulesPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { session, loading: authLoading } = useRequireAuth();

  const [course, setCourse] = useState<CatalogCourse | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const loadModules = async () => {
    if (!session) return;
    try {
      const mods = await getCourseModules(session.access_token, courseId);
      if (Array.isArray(mods)) {
        setModules(mods.sort((a, b) => a.module_order - b.module_order));
      }
    } catch (e) {
      console.error("Error al cargar módulos:", e);
    }
  };

  useEffect(() => {
    if (!session || !courseId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [courseData] = await Promise.all([
          getCourseDetail(courseId),
          loadModules(),
        ]);
        setCourse(courseData);
      } catch (e) {
        console.error("Error al cargar el curso:", e);
        setError("No pudimos cargar este curso. Inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session, courseId]);

  if (authLoading || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-destructive font-medium">{error || "Curso no encontrado."}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary hover:underline">
          ← Volver al dashboard
        </Link>
      </div>
    );
  }

  const group = getAssetGroup(course);
  const completedCount = modules.filter((m) => m.passed).length;
  const progressPct = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  return (
    <div className="min-h-full bg-[#fbfaff]">
      <main className="mx-auto max-w-[1000px] px-5 py-6 sm:px-8 lg:px-10">
        {/* Tab para volver al dashboard */}
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#e7e4ef] bg-white px-3.5 py-1.5 text-xs font-semibold text-on-surface transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al dashboard
        </Link>

        {/* Hero con imagen de fondo, igual estilo que el catálogo de cursos */}
        <section className="relative mb-6 overflow-hidden rounded-2xl border border-[#ece9f7] shadow-[0_10px_30px_rgba(72,36,175,.05)]">
          <div className="relative h-48 overflow-hidden bg-[radial-gradient(circle_at_65%_25%,rgba(177,132,255,.9),transparent_25%),linear-gradient(125deg,#1c1454_0%,#4c20c8_55%,#0f0a35_100%)]">
            <img
              src={`/img/courses/hero-${group}.png`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120b42]/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm mb-2">
                {course.platform || "SmartPath"}
              </span>
              <h1 className="font-display text-2xl font-bold text-white leading-snug md:text-3xl">
                {course.title || "Curso sin título"}
              </h1>
              {course.instructor && (
                <p className="mt-1 text-sm text-white/80">Por {course.instructor}</p>
              )}
            </div>
          </div>

          {/* Datos básicos */}
          <div className="grid grid-cols-2 gap-3 border-t border-[#f0edf6] bg-white p-5 sm:grid-cols-4">
            <CourseFact icon={<Clock3 className="h-4 w-4" />} value={course.duration_hours ? `${course.duration_hours}h` : "—"} label="Duración" />
            <CourseFact icon={<GraduationCap className="h-4 w-4" />} value={formatCourseValue(course.level)} label="Nivel" />
            <CourseFact icon={<BookOpen className="h-4 w-4" />} value={course.price ? formatCourseValue(course.price) : "—"} label="Precio" />
            <CourseFact icon={<Award className="h-4 w-4" />} value={course.certificate ? "Sí" : "No"} label="Certificado" />
          </div>

          {course.url && (
            <div className="border-t border-[#f0edf6] bg-white px-5 pb-5 pt-3">
              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              >
                Ver curso original <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </section>

        {/* Progreso general del curso */}
        <section className="mb-6 rounded-2xl border border-[#e9e7f0] bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-on-surface">Tu progreso</h2>
            <span className="text-sm font-semibold text-emerald-600">{progressPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">
            {completedCount} de {modules.length} módulos completados
          </p>
        </section>

        {/* Lista de módulos y exámenes */}
        <section className="rounded-2xl border border-[#e9e7f0] bg-white p-5">
          <h2 className="mb-4 font-display text-base font-bold text-on-surface">Módulos de aprendizaje y evaluaciones</h2>

          {modules.length > 0 ? (
            <div className="space-y-2.5">
              {modules.map((mod: any, mIdx: number) => {
                const locked = isModuleLocked(modules, mIdx);
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
        </section>
      </main>

      {activeModuleId && (
        <QuizModal
          moduleId={activeModuleId}
          onClose={() => setActiveModuleId(null)}
          onComplete={loadModules}
        />
      )}
    </div>
  );
}

function CourseFact({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto mb-1 flex justify-center text-primary">{icon}</span>
      <strong className="block truncate text-xs text-on-surface" title={value}>{value}</strong>
      <span className="text-[10px] text-on-surface-variant">{label}</span>
    </div>
  );
}