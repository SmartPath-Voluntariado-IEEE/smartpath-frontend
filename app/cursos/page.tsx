"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock3,
  Filter,
  GraduationCap,
  Layers3,
  Loader2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/use-profile";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { 
  getCatalogCourses, 
  getCatalogSkills, 
  getRoadmap, 
  getDashboardCourseProgress, 
  selectCourseForSkill, 
  type CatalogCourse 
} from "@/services/api";
import { getSkillIcon } from "@/lib/skill-icon-map";

type CatalogSkill = {
  slug: string;
  name: string;
  category?: string | null;
};

type PriceFilter = "all" | "free" | "paid";
type DurationFilter = "all" | "short" | "medium" | "long";

const PAGE_SIZE = 12;

const ASSET_GROUPS: Record<string, string> = {
  aws: "cloud",
  azure: "cloud",
  cloud: "cloud",
  docker: "devops",
  kubernetes: "devops",
  linux: "devops",
  python: "data",
  pandas: "data",
  sql: "data",
  postgresql: "data",
  postgres: "data",
  powerbi: "data",
  tensorflow: "ai",
  machinelearning: "ai",
  react: "web",
  nextjs: "web",
  javascript: "web",
  typescript: "web",
  html: "web",
  css: "web",
  nodejs: "web",
  android: "mobile",
  kotlin: "mobile",
  cybersecurity: "cybersecurity",
};

function getAssetGroup(courseOrSkill: CatalogCourse | CatalogSkill | undefined) {
  if (!courseOrSkill) return "default";
  const slugs = "skill_slugs" in courseOrSkill ? courseOrSkill.skill_slugs : [courseOrSkill.slug];
  const category = "category" in courseOrSkill ? courseOrSkill.category?.toLowerCase() : undefined;
  const match = slugs.find((slug) => ASSET_GROUPS[slug.toLowerCase()]);

  if (match) return ASSET_GROUPS[match.toLowerCase()];
  if (category?.includes("data")) return "data";
  if (category?.includes("cloud")) return "cloud";
  if (category?.includes("web")) return "web";
  if (category?.includes("mobile")) return "mobile";
  return "default";
}

function isFreeCourse(price: string | null) {
  const normalized = price?.trim().toLowerCase() ?? "";
  return normalized.includes("gratis") || normalized.includes("free") || normalized === "0";
}

function formatCourseValue(value: string | null | undefined) {
  if (!value) return "Por definir";

  const normalized = value.trim().toLowerCase();
  const translations: Record<string, string> = {
    all: "Todos",
    free: "Gratis",
    gratis: "Gratis",
    "paid course": "De pago",
    paid: "De pago",
    beginner: "Principiante",
    basic: "Básico",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    spanish: "Español",
    english: "Inglés",
  };

  return translations[normalized] ?? value;
}

function levelLabel(level: string | null) {
  return formatCourseValue(level);
}

function assetPath(kind: "hero" | "card", group: string) {
  return `/img/courses/${kind}-${group}.png`;
}

function CourseImage({ course }: { course: CatalogCourse }) {
  const group = getAssetGroup(course);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-36 overflow-hidden bg-[radial-gradient(circle_at_65%_25%,rgba(177,132,255,.9),transparent_25%),linear-gradient(125deg,#1c1454_0%,#4c20c8_55%,#0f0a35_100%)]">
      {!failed && (
        <img
          src={assetPath("card", group)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#120b42]/45 to-transparent" />
      <div className="absolute right-5 bottom-3 grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-sm">
        <GraduationCap className="h-7 w-7" />
      </div>
      <span className="absolute top-3 left-3 rounded-full bg-[#1b1551]/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        {course.platform || "SmartPath"}
      </span>
      {course.rating !== null && course.rating !== undefined && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#1b1551]/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> {course.rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const requestedSkill = searchParams.get("skill");
  const { session, loading: authLoading } = useRequireAuth();
  const { profile } = useProfile();

  const [courses, setCourses] = useState<CatalogCourse[]>([]);
  const [skills, setSkills] = useState<CatalogSkill[]>([]);
  const [activeSkill, setActiveSkill] = useState<string | null>(requestedSkill);
  const [platform, setPlatform] = useState("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [level, setLevel] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Almacena los IDs de los cursos ya seleccionados
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  useEffect(() => {
    setActiveSkill(requestedSkill);
  }, [requestedSkill]);

  useEffect(() => {
    async function loadRelevantData() {
      if (!session) return;
      try {
        setLoading(true);
        setError(null);
        
        // Cargamos skills, roadmap y el progreso de cursos en paralelo
        const [skillsData, roadmapData, courseProgressData] = await Promise.all([
          getCatalogSkills(),
          getRoadmap(session.access_token),
          getDashboardCourseProgress(session.access_token),
        ]);
        
        const roadmapSlugs = roadmapData.flatMap((roadmapLevel: any) =>
          roadmapLevel.skills?.map((skill: any) => skill.skill_slug || skill.slug) ?? [],
        );
        const profileSlugs = profile?.skills.map((skill) => skill.skillId) ?? [];
        const relevantSlugs = new Set(roadmapSlugs.length > 0 ? roadmapSlugs : profileSlugs);
        const relevantSkills = skillsData.filter((skill: CatalogSkill) => relevantSlugs.has(skill.slug));

        // Extraemos los IDs de los cursos ya seleccionados desde el resumen de progreso
        const selectedIds: number[] = [];
        if (Array.isArray(courseProgressData)) {
          courseProgressData.forEach((item: any) => {
            if (item.course_id !== null && item.course_id !== undefined) {
              selectedIds.push(Number(item.course_id));
            }
          });
        }
        
        setSelectedCourseIds(selectedIds);

        setSkills(relevantSkills);
        setActiveSkill((current) =>
          relevantSkills.some((skill: CatalogSkill) => skill.slug === current)
            ? current
            : relevantSkills[0]?.slug ?? null,
        );
      } catch (loadError) {
        console.error("Error al cargar los datos del roadmap:", loadError);
        setError("No pudimos cargar las habilidades de tu roadmap. Inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) loadRelevantData();
  }, [authLoading, profile?.skills, session]);

  useEffect(() => {
    async function loadCourses() {
      if (!activeSkill) return;
      try {
        setLoading(true);
        setError(null);
        const coursesData = await getCatalogCourses(activeSkill, { limit: PAGE_SIZE });
        setCourses(coursesData);
        setHasMore(coursesData.length === PAGE_SIZE);
      } catch (loadError) {
        console.error("Error al cargar los cursos:", loadError);
        setError("No pudimos cargar los cursos de esta habilidad. Inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [activeSkill]);

  const platforms = useMemo(
    () => [...new Set(courses.map((course) => course.platform).filter((value): value is string => Boolean(value)))].sort(),
    [courses],
  );

  const levels = useMemo(
    () => [...new Set(courses.map((course) => course.level).filter((value): value is string => Boolean(value)))].sort(),
    [courses],
  );

  const selectedSkill = skills.find((skill) => skill.slug === activeSkill);
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesPlatform = platform === "all" || course.platform === platform;
      const matchesPrice = price === "all" || (price === "free" ? isFreeCourse(course.price) : !isFreeCourse(course.price));
      const matchesLevel = level === "all" || course.level === level;
      const hours = course.duration_hours;
      const matchesDuration =
        duration === "all" ||
        (duration === "short" && hours !== null && hours !== undefined && hours <= 10) ||
        (duration === "medium" && hours !== null && hours !== undefined && hours > 10 && hours <= 30) ||
        (duration === "long" && hours !== null && hours !== undefined && hours > 30);

      return matchesPlatform && matchesPrice && matchesDuration && matchesLevel;
    });
  }, [courses, duration, level, platform, price]);

  const activeFilterCount = [platform !== "all", price !== "all", duration !== "all", level !== "all"].filter(Boolean).length;
  const clearFilters = () => {
    setPlatform("all");
    setPrice("all");
    setDuration("all");
    setLevel("all");
  };

  async function loadMoreCourses() {
    if (!activeSkill || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextCourses = await getCatalogCourses(activeSkill, { limit: PAGE_SIZE, offset: courses.length });
      setCourses((current) => [...current, ...nextCourses]);
      setHasMore(nextCourses.length === PAGE_SIZE);
    } catch (loadError) {
      console.error("Error al cargar más cursos:", loadError);
      setError("No pudimos cargar más cursos. Inténtalo nuevamente.");
    } finally {
      setLoadingMore(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Cargando cursos" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#fbfaff]">
      <main className="mx-auto min-w-0 max-w-[1240px] px-5 py-6 sm:px-8 lg:px-10">
          <section className="relative mb-5 overflow-hidden rounded-2xl border border-[#ece9f7] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(72,36,175,.05)] sm:px-7">
            <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_70%_45%,rgba(136,82,255,.55),transparent_25%),radial-gradient(circle_at_43%_55%,rgba(243,220,255,.9),transparent_48%)] md:block" />
            {selectedSkill && <HeroAsset skill={selectedSkill} />}
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Cursos para tu roadmap
              </span>
              <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
                {selectedSkill ? <>Cursos para <span className="gradient-text">{selectedSkill.name}</span></> : "Cursos recomendados para ti"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                Explora cursos seleccionados para desarrollar las habilidades que más importan en tu camino profesional.
                {profile?.availabilityHours ? ` Organiza tu aprendizaje en bloques de ${profile.availabilityHours}h por semana.` : ""}
              </p>
            </div>
          </section>

          <section className="mb-5 rounded-2xl border border-[#e9e7f0] bg-white p-3 shadow-[0_4px_20px_rgba(13,17,51,.04)]">
            <div className="flex flex-wrap items-center gap-2">
              {skills.map((skill) => (
                <button
                  key={skill.slug}
                  type="button"
                  onClick={() => setActiveSkill(skill.slug)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeSkill === skill.slug ? "border-primary bg-primary text-white shadow-sm" : "border-[#e7e4ef] text-on-surface hover:border-primary/40 hover:text-primary"}`}
                >
                  {getSkillIcon(skill.slug, 15, activeSkill === skill.slug ? "text-white" : "text-primary")} {skill.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowFilters((current) => !current)}
                className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-[#ded9ee] px-4 py-2 text-xs font-semibold text-on-surface transition hover:border-primary hover:text-primary"
                aria-expanded={showFilters}
              >
                <Filter className="h-3.5 w-3.5" /> Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
            </div>

            {showFilters && (
              <div className="mt-3 grid gap-3 border-t border-[#eeeaf7] pt-4 sm:grid-cols-2 xl:grid-cols-5">
                <FilterSelect label="Plataforma" value={platform} onChange={setPlatform} options={platforms} />
                <FilterSelect label="Precio" value={price} onChange={(value) => setPrice(value as PriceFilter)} options={["Gratis", "De pago"]} values={["free", "paid"]} />
                <FilterSelect label="Duración" value={duration} onChange={(value) => setDuration(value as DurationFilter)} options={["Hasta 10 h", "11 a 30 h", "Más de 30 h"]} values={["short", "medium", "long"]} />
                <FilterSelect label="Nivel" value={level} onChange={setLevel} options={levels} />
                <Button variant="ghost" className="mt-5 text-primary hover:bg-primary/5" onClick={clearFilters} disabled={activeFilterCount === 0}>
                  <X className="h-4 w-4" /> Limpiar filtros
                </Button>
              </div>
            )}
          </section>

          {error ? (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-card">
              <p className="font-semibold text-error">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm text-on-surface-variant"><strong className="text-on-surface">{filteredCourses.length}</strong> cursos encontrados</p>
                {activeSkill && <span className="hidden text-xs text-primary sm:inline">Habilidad seleccionada: {selectedSkill?.name ?? activeSkill}</span>}
              </div>

              {filteredCourses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => {
                    const isSelected = selectedCourseIds.includes(Number(course.id));
                    return (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        skills={skills} 
                        session={session}
                        activeSkill={activeSkill}
                        isSelected={isSelected}
                        onSelectSuccess={(courseId) => {
                          setSelectedCourseIds((prev) => [...prev, courseId]);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#dcd6ef] bg-white px-6 py-14 text-center">
                  <Layers3 className="mx-auto h-9 w-9 text-primary" />
                  <h2 className="mt-4 font-display text-xl font-bold text-on-surface">No encontramos cursos con esos filtros</h2>
                  <p className="mt-2 text-sm text-on-surface-variant">Prueba una combinación distinta o elimina alguno de los filtros aplicados.</p>
                  <Button variant="outline" className="mt-5 border-primary/30 text-primary" onClick={clearFilters}>Limpiar filtros</Button>
                </div>
              )}
              {hasMore && !error && (
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5" onClick={loadMoreCourses} disabled={loadingMore}>
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {loadingMore ? "Cargando cursos..." : "Cargar más cursos"}
                  </Button>
                </div>
              )}
            </>
          )}

          <section className="mt-8 grid gap-4 rounded-2xl border border-[#ebe8f4] bg-white p-5 text-sm text-on-surface-variant shadow-[0_4px_20px_rgba(13,17,51,.04)] md:grid-cols-3">
            <p className="flex items-start gap-3"><Layers3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Catálogo actualizado con cursos vinculados a habilidades.</p>
            <p className="flex items-start gap-3"><Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Compara precio, nivel, duración y certificación antes de elegir.</p>
            <p className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> Encuentra opciones alineadas a tu ruta de aprendizaje.</p>
          </section>
      </main>
    </div>
  );
}

function HeroAsset({ skill }: { skill: CatalogSkill }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return <img src={assetPath("hero", getAssetGroup(skill))} alt="" className="absolute right-5 bottom-0 hidden h-[92%] max-w-[38%] object-contain md:block" onError={() => setFailed(true)} />;
}

function FilterSelect({ label, value, onChange, options, values = options }: { label: string; value: string; onChange: (value: string) => void; options: string[]; values?: string[] }) {
  const selectedIndex = values.indexOf(value);
  const selectedLabel = value === "all" ? "Todos" : formatCourseValue(options[selectedIndex] ?? value);

  return (
    <label className="block text-xs font-medium text-on-surface-variant">
      {label}
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue || "all")}>
        <SelectTrigger className="mt-1.5 h-9 w-full rounded-lg border-[#e1ddeb] bg-white font-medium text-on-surface hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/15">
          <SelectValue>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-[#e1ddeb] bg-white p-1.5 shadow-[0_12px_28px_rgba(57,31,134,.14)]">
          <SelectItem value="all" className="cursor-pointer rounded-lg px-2.5 py-2 text-on-surface data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary">Todos</SelectItem>
          {options.map((option, index) => (
            <SelectItem key={values[index]} value={values[index]} className="cursor-pointer rounded-lg px-2.5 py-2 text-on-surface data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary">
              {formatCourseValue(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function CourseCard({ 
  course, 
  skills, 
  session, 
  activeSkill, 
  isSelected, 
  onSelectSuccess 
}: { 
  course: CatalogCourse; 
  skills: CatalogSkill[]; 
  session: any; 
  activeSkill: string | null;
  isSelected: boolean;
  onSelectSuccess: (courseId: number) => void;
}) {
  const skillNames = course.skill_slugs.map((slug) => skills.find((skill) => skill.slug === slug)?.name ?? slug).slice(0, 2);
  const [loading, setLoading] = useState(false);
  
  return (
    <article className="group flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-[#e8e5f0] bg-white shadow-[0_5px_22px_rgba(13,17,51,.06)] transition-transform hover:-translate-y-0.5 hover:shadow-highlight">
      <CourseImage course={course} />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex h-7 flex-nowrap gap-2 overflow-hidden text-[11px] font-medium text-primary">
          {skillNames.map((name) => <span key={name} className="rounded-full bg-primary/8 px-2.5 py-1">{name}</span>)}
        </div>
        <h2 className="mt-3 h-[3.1rem] line-clamp-2 font-display text-[17px] font-bold leading-snug text-on-surface">{course.title || "Curso sin título"}</h2>
        <p className="mt-1.5 h-5 truncate text-xs text-on-surface-variant">{course.instructor ? `Por ${course.instructor}` : ""}</p>
        <div className="mt-3 grid grid-cols-4 gap-1 border-y border-[#f0edf6] py-2.5 text-center text-[11px] text-on-surface-variant">
          <CourseFact icon={<Clock3 className="h-3.5 w-3.5" />} value={course.duration_hours ? `${course.duration_hours}h` : "—"} label="Duración" />
          <CourseFact icon={<GraduationCap className="h-3.5 w-3.5" />} value={levelLabel(course.level)} label="Nivel" />
          <CourseFact icon={<BookOpen className="h-3.5 w-3.5" />} value={course.price ? formatCourseValue(course.price) : "—"} label="Precio" />
          <CourseFact icon={<Award className="h-3.5 w-3.5" />} value={course.certificate ? "Sí" : "No"} label="Certificado" />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
          <span>{course.language ? formatCourseValue(course.language) : "Idioma por confirmar"}</span>
          {course.rating !== null && course.rating !== undefined && <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating.toFixed(1)}</span>}
        </div>
        
        {/* Botón reactivo */}
        <Button
          className={`mt-3 w-full text-white transition-all ${
            isSelected 
              ? "bg-emerald-600 hover:bg-emerald-700 cursor-default shadow-sm" 
              : "gradient-brand hover:opacity-95"
          }`}
          disabled={isSelected || loading}
          onClick={async () => {
            if (!session || !activeSkill || isSelected) return;
            try {
              setLoading(true);
              await selectCourseForSkill(session.access_token, activeSkill, Number(course.id));
              onSelectSuccess(Number(course.id));
              toast.success("Curso incluido en tu roadmap");
            } catch (err) {
              console.error("Error al vincular el curso:", err);
              toast.error("No se pudo vincular el curso. Inténtalo de nuevo.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSelected ? (
            "Curso incluido en tu roadmap"
          ) : (
            "Seleccionar para mi roadmap"
          )}
        </Button>

        {course.url ? (
          <a href={course.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-primary/30 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white">
            Ver curso <ArrowRight className="h-4 w-4" />
          </a>
        ) : <span className="mt-2 inline-flex h-9 items-center justify-center rounded-xl border border-[#e7e3ef] text-sm font-medium text-on-surface-variant">Enlace no disponible</span>}
      </div>
    </article>
  );
}

function CourseFact({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div><span className="mx-auto mb-1 flex justify-center text-primary">{icon}</span><strong className="block truncate text-[11px] text-on-surface" title={value}>{value}</strong><span>{label}</span></div>;
}

export default function CoursesPage() {
  return <Suspense fallback={<div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}><CoursesContent /></Suspense>;
}