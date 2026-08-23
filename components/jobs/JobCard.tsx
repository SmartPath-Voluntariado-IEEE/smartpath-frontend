"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Languages,
  MapPin,
  Sparkles,
  Wallet,
} from "lucide-react";

import type { JobRecommendation, JobRequirementItem } from "@/services/api";

/**
 * Etiqueta legible de una habilidad a partir de su slug.
 *
 * El backend devuelve slugs y el catálogo tiene los nombres bonitos, pero
 * pedirlo entero solo para rotular chips sería un viaje de más: para los
 * casos que no están en el mapa, capitalizar el slug da un resultado
 * aceptable ("graphql" -> "Graphql").
 */
const SKILL_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  nodejs: "Node.js",
  nextjs: "Next.js",
  postgres: "PostgreSQL",
  powerbi: "Power BI",
  aws: "AWS",
  gcp: "GCP",
  sql: "SQL",
  rest: "REST APIs",
  css: "CSS",
  html: "HTML",
  php: "PHP",
  ml: "Machine Learning",
};

function skillLabel(slug: string) {
  return SKILL_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Color del anillo de afinidad según qué tan alta sea. */
function matchTone(percentage: number) {
  if (percentage >= 70) return { text: "text-success", ring: "#00C48C" };
  if (percentage >= 40) return { text: "text-primary", ring: "#6E43FF" };
  return { text: "text-text-secondary", ring: "#9CA3AF" };
}

function formatSalary(job: JobRecommendation["job"]) {
  const { salary_min, salary_max, salary_currency, salary_interval } = job;

  if (!salary_min && !salary_max) return null;

  const currency = salary_currency === "PEN" ? "S/" : salary_currency ?? "";
  const period =
    salary_interval === "yearly"
      ? "/año"
      : salary_interval === "hourly"
        ? "/hora"
        : "/mes";

  const format = (value: number) => value.toLocaleString("es-PE");

  const range =
    salary_min && salary_max && salary_min !== salary_max
      ? `${format(salary_min)} – ${format(salary_max)}`
      : format((salary_min || salary_max) as number);

  return `${currency} ${range}${period}`.trim();
}

/** "hace 3 días" a partir de la fecha de publicación. */
function relativeDate(value: string | null) {
  if (!value) return null;

  const days = Math.floor(
    (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (Number.isNaN(days) || days < 0) return null;
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} sem.`;
  return `Hace ${Math.floor(days / 30)} meses`;
}

const REQUIREMENT_ICONS: Record<JobRequirementItem["type"], typeof Briefcase> = {
  experiencia: Briefcase,
  educacion: GraduationCap,
  idioma: Languages,
  contrato: Briefcase,
  modalidad: MapPin,
};

function SkillChip({
  slug,
  variant,
}: {
  slug: string;
  variant: "matched" | "route" | "missing" | "neutral";
}) {
  const styles = {
    // Ya la tienes: verde, es una razón para postular.
    matched: "bg-[#E6F9F3] text-[#00875F] border-[#B8EEDD]",
    // Te falta pero tu ruta la enseña: morado, es el puente con el roadmap.
    route: "bg-[#F3F0FF] text-[#6E43FF] border-[#DDD4FF]",
    // Te falta y está fuera de tu ruta: gris, es contexto, no una meta.
    missing: "bg-[#F8FAFC] text-[#6B7280] border-[#E5E7EB]",
    neutral: "bg-[#F8FAFC] text-[#6B7280] border-[#E5E7EB]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {skillLabel(slug)}
    </span>
  );
}

export function JobCard({ item }: { item: JobRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const { job } = item;

  const tone = matchTone(item.match_percentage);
  const salary = formatSalary(job);
  const posted = relativeDate(job.posted_at);

  // Se muestran primero las que ya tienes y luego las que tu ruta cubre:
  // ese orden cuenta la historia de "esto ya lo cumples, esto lo alcanzas".
  const visibleSkills = [
    ...item.matched_skills.map((slug) => ({ slug, variant: "matched" as const })),
    ...item.missing_from_route.map((slug) => ({ slug, variant: "route" as const })),
    ...item.missing_skills
      .filter((slug) => !item.missing_from_route.includes(slug))
      .map((slug) => ({ slug, variant: "missing" as const })),
  ];

  const shownSkills = expanded ? visibleSkills : visibleSkills.slice(0, 8);
  const hiddenCount = visibleSkills.length - shownSkills.length;

  return (
    <article className="surface-card p-5 transition-shadow hover:shadow-[0_8px_30px_rgba(110,67,255,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-bold leading-snug text-text-primary">
            {job.position ?? "Puesto sin título"}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
            {job.company && (
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {job.company}
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
            )}
            {job.is_remote && (
              <span className="rounded-pill bg-[#E6F9F3] px-2 py-0.5 font-medium text-[#00875F]">
                Remoto
              </span>
            )}
            {job.seniority && (
              <span className="rounded-pill bg-surface-variant px-2 py-0.5 font-medium text-primary">
                {job.seniority}
              </span>
            )}
          </div>
        </div>

        {/* Afinidad. El número grande es el puntaje final; debajo se dice de
            qué está hecho, porque un porcentaje sin explicación no ayuda a
            decidir si postular. */}
        <div className="shrink-0 text-right">
          <div className={`font-display text-2xl font-extrabold ${tone.text}`}>
            {item.match_percentage}%
          </div>
          <div className="text-[10px] uppercase tracking-wide text-text-secondary">
            afinidad
          </div>
        </div>
      </div>

      {/* Desglose del puntaje */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium text-text-secondary">
              Alineación con tu ruta
            </span>
            <span className="text-[11px] font-semibold text-text-primary">
              {item.alignment_percentage}%
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-pill bg-[#F1F5F9]">
            <div
              className="h-full rounded-pill bg-primary"
              style={{ width: `${item.alignment_percentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium text-text-secondary">
              Ya lo cumples
            </span>
            <span className="text-[11px] font-semibold text-text-primary">
              {item.readiness_percentage}%
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-pill bg-[#F1F5F9]">
            <div
              className="h-full rounded-pill bg-success"
              style={{ width: `${item.readiness_percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Requisitos extraídos por HU-58 */}
      {(job.requirements?.length ?? 0) > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.requirements.map((requirement) => {
            const Icon = REQUIREMENT_ICONS[requirement.type] ?? Briefcase;
            return (
              <span
                key={`${requirement.type}-${requirement.label}`}
                className="inline-flex items-center gap-1 rounded-pill border border-border-light bg-surface-dim px-2.5 py-0.5 text-xs text-text-secondary"
              >
                <Icon className="h-3 w-3" />
                {requirement.label}
              </span>
            );
          })}
          {salary && (
            <span className="inline-flex items-center gap-1 rounded-pill border border-border-light bg-surface-dim px-2.5 py-0.5 text-xs font-medium text-text-primary">
              <Wallet className="h-3 w-3" />
              {salary}
            </span>
          )}
        </div>
      )}

      {/* Tecnologías */}
      {visibleSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {shownSkills.map(({ slug, variant }) => (
            <SkillChip key={slug} slug={slug} variant={variant} />
          ))}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-0.5 rounded-pill px-2 py-0.5 text-xs font-medium text-primary hover:underline"
            >
              +{hiddenCount} más
              <ChevronDown className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Puente con el roadmap: la razón por la que esta pestaña vive dentro
          de SmartPath y no es un portal de empleo más. */}
      {item.missing_from_route.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-sm bg-surface-variant px-3 py-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-text-primary">
            Te{" "}
            {item.missing_from_route.length === 1
              ? "falta 1 habilidad"
              : `faltan ${item.missing_from_route.length} habilidades`}{" "}
            que tu ruta ya cubre:{" "}
            <span className="font-semibold">
              {item.missing_from_route.map(skillLabel).join(", ")}
            </span>
            .{" "}
            <Link
              href={`/cursos?skill=${item.missing_from_route[0]}`}
              className="font-semibold text-primary hover:underline"
            >
              Ver cursos
            </Link>
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-light pt-3">
        <span className="text-[11px] text-text-secondary">
          {posted && <>{posted} · </>}
          {job.source && <span className="capitalize">{job.source}</span>}
        </span>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Ver oferta
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
