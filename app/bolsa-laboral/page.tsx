"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Loader2, RotateCw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobCard } from "@/components/jobs/JobCard";
import { useProfile } from "@/hooks/use-profile";
import { useRequireAuth } from "@/hooks/use-require-auth";
import {
  getJobRecommendations,
  type JobRecommendationsResponse,
} from "@/services/api";
import { BolsaLaboralSkeleton } from "@/components/skeletons";

const PAGE_SIZE = 12;

// Los botones `variant="outline"` del kit base dependen de tokens de color
// (`border-border`, `bg-background`) que este proyecto no define, así que
// caen a un negro sin estilizar. Se sobreescribe con la paleta que ya usa
// el resto de la app (mismo patrón que /cursos).
const OUTLINE_BUTTON_CLASS =
  "rounded-lg border-[#e1ddeb] bg-white font-medium text-text-primary hover:border-primary/50 hover:bg-surface-variant hover:text-primary";

const SENIORITY_OPTIONS = [
  { value: "all", label: "Todos los niveles" },
  { value: "Practicante", label: "Practicante" },
  { value: "Junior", label: "Junior" },
  { value: "Semi Senior", label: "Semi Senior" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
];

const MATCH_OPTIONS = [
  { value: "0", label: "Cualquier afinidad" },
  { value: "30", label: "Afinidad 30%+" },
  { value: "50", label: "Afinidad 50%+" },
  { value: "70", label: "Afinidad 70%+" },
];

export default function BolsaLaboralPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated } = useProfile();

  const [data, setData] = useState<JobRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [seniority, setSeniority] = useState("all");
  const [minMatch, setMinMatch] = useState("0");
  const [remoteOnly, setRemoteOnly] = useState(false);

  // El texto se guarda aparte del término aplicado para no lanzar una
  // petición por cada tecla: la búsqueda se dispara al enviar el formulario.
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const load = useCallback(async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getJobRecommendations(session.access_token, {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        minMatch: Number(minMatch),
        seniority: seniority === "all" ? undefined : seniority,
        remoteOnly,
        search: appliedSearch || undefined,
      });

      setData(response);
    } catch (err) {
      console.error("Error al cargar la bolsa laboral:", err);
      setError(
        "No pudimos cargar las ofertas. Revisa tu conexión e inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }, [session, page, minMatch, seniority, remoteOnly, appliedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  // Cambiar un filtro debe devolver a la primera página: si estabas en la
  // página 3 y filtras a algo con dos resultados, quedarías viendo un vacío
  // que parece un error.
  const resetAnd = (apply: () => void) => {
    setPage(0);
    apply();
  };

  const totalPages = useMemo(
    () => (data ? Math.ceil(data.total / PAGE_SIZE) : 0),
    [data]
  );

  const initialLoading = !hydrated || authLoading || (loading && !data);

  if (initialLoading) {
    return <BolsaLaboralSkeleton />;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Crea tu perfil primero
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          La bolsa laboral recomienda ofertas según la ruta que elegiste.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-sm bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Empezar
        </Link>
      </div>
    );
  }

  const hasFilters =
    seniority !== "all" || minMatch !== "0" || remoteOnly || !!appliedSearch;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      {/* Encabezado */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-primary">
          <Briefcase className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Bolsa laboral
          </span>
        </div>

        <h1 className="mt-2 font-display text-2xl font-extrabold text-text-primary md:text-3xl">
          Ofertas alineadas con tu ruta
        </h1>

        {data?.target_role_label && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Estas ofertas se ordenan según tu ruta hacia{" "}
            <span className="font-semibold text-text-primary">
              {data.target_role_label}
            </span>
            . La afinidad combina qué tanto tiene que ver la oferta con tu ruta
            y cuánto de lo que exige ya dominas.
          </p>
        )}
      </header>

      {/* Filtros */}
      <div className="surface-card mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <form
            className="flex min-w-[240px] flex-1 items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              resetAnd(() => setAppliedSearch(searchText.trim()));
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Puesto, empresa o ciudad…"
                className="rounded-lg border-[#e1ddeb] bg-white pl-9 text-text-primary placeholder:text-text-secondary focus-visible:border-primary focus-visible:ring-primary/15"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className={OUTLINE_BUTTON_CLASS}
            >
              Buscar
            </Button>
          </form>

          <Select
            value={seniority}
            onValueChange={(value) => resetAnd(() => setSeniority(value ?? "all"))}
          >
            <SelectTrigger className="w-[170px] rounded-lg border-[#e1ddeb] bg-white font-medium text-on-surface hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/15">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-[#e1ddeb] bg-white p-1.5 shadow-[0_12px_28px_rgba(57,31,134,.14)] ring-0">
              {SENIORITY_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-lg px-2.5 py-2 text-on-surface data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={minMatch}
            onValueChange={(value) => resetAnd(() => setMinMatch(value ?? "0"))}
          >
            <SelectTrigger className="w-[180px] rounded-lg border-[#e1ddeb] bg-white font-medium text-on-surface hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/15">
              <SelectValue placeholder="Afinidad" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-[#e1ddeb] bg-white p-1.5 shadow-[0_12px_28px_rgba(57,31,134,.14)] ring-0">
              {MATCH_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-lg px-2.5 py-2 text-on-surface data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={() => resetAnd(() => setRemoteOnly(!remoteOnly))}
            className={`inline-flex h-9 items-center gap-1.5 rounded-sm border px-3 text-sm font-medium transition-colors ${
              remoteOnly
                ? "border-primary bg-surface-variant text-primary"
                : "border-border-light text-text-secondary hover:text-primary"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Solo remoto
          </button>

          <Button
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:bg-surface-variant hover:text-primary"
            onClick={() => load()}
            disabled={loading}
            title="Recargar"
          >
            <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {data && (
          <p className="mt-3 text-xs text-text-secondary">
            {data.total === 0
              ? "Sin resultados"
              : `${data.total} ${data.total === 1 ? "oferta" : "ofertas"}`}
            {hasFilters && " con los filtros aplicados"}
          </p>
        )}
      </div>

      {error && (
        <div className="surface-card border-error/30 bg-[#FEF2F2] p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Resultados */}
      {!error && data && data.results.length === 0 && (
        <div className="surface-card p-10 text-center">
          <h3 className="font-display text-lg font-bold text-text-primary">
            {hasFilters
              ? "Ninguna oferta coincide con estos filtros"
              : "Todavía no hay ofertas recolectadas"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasFilters
              ? "Prueba a bajar la afinidad mínima o a quitar el filtro de nivel."
              : "Las ofertas se recolectan de portales reales (Indeed, LinkedIn). Pide al equipo que ejecute la recolección para poblar la bolsa laboral."}
          </p>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              className={`mt-5 ${OUTLINE_BUTTON_CLASS}`}
              onClick={() =>
                resetAnd(() => {
                  setSeniority("all");
                  setMinMatch("0");
                  setRemoteOnly(false);
                  setSearchText("");
                  setAppliedSearch("");
                })
              }
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      {!error && data && data.results.length > 0 && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.results.map((item) => (
              <JobCard key={item.job.id} item={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className={OUTLINE_BUTTON_CLASS}
                disabled={page === 0 || loading}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                Anterior
              </Button>

              <span className="text-sm text-text-secondary">
                Página {page + 1} de {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                className={OUTLINE_BUTTON_CLASS}
                disabled={page >= totalPages - 1 || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
