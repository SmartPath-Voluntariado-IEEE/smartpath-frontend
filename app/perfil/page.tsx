"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { defaultProfile, type UserProfile } from "@/lib/profile-store";
import { type SkillLevel } from "@/lib/smartpath-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getCatalogSkills, getCatalogRoles, upsertBackendProfile } from "@/services/api";

export default function ProfilePage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated, save } = useProfile();
  const router = useRouter();
  const [form, setForm] = useState<UserProfile>(defaultProfile);

  const [skills, setSkills] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [skillSearch, setSkillSearch] = useState("");

  useEffect(() => {
    if (hydrated && profile) setForm(profile);
  }, [hydrated, profile]);

  useEffect(() => {
    if (!session) return;
    const loadCatalogs = async () => {
      try {
        setLoadingData(true);
        const [skillsData, rolesData] = await Promise.all([
          getCatalogSkills(),
          getCatalogRoles()
        ]);
        setSkills(skillsData);
        setRoles(rolesData);
      } catch (err) {
        console.error("Error al cargar catálogos del perfil:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadCatalogs();
  }, [session]);

  const loading = !hydrated || authLoading || loadingData;

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900">Primero inicia sesión</h1>
        <Link href="/login" className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/80">
          Ir a login
        </Link>
      </div>
    );
  }

  function update<K extends keyof UserProfile>(k: K, v: UserProfile[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleSkill(skillSlug: string, level: SkillLevel) {
    setForm((f) => {
      const exists = f.skills.find((s) => s.skillId === skillSlug);
      if (exists && exists.level === level) return { ...f, skills: f.skills.filter((s) => s.skillId !== skillSlug) };
      if (exists) return { ...f, skills: f.skills.map((s) => (s.skillId === skillSlug ? { ...s, level } : s)) };
      return { ...f, skills: [...f.skills, { skillId: skillSlug, level }] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    save(form);

    if (session) {
      try {
        await upsertBackendProfile(session.access_token, form);
        toast.success("Perfil sincronizado con el backend");
      } catch (err) {
        console.error("Error al sincronizar con el backend:", err);
        toast.warning("Perfil guardado localmente, pero no se pudo sincronizar con el backend");
      }
    }

    router.push("/dashboard");
  }

  const filteredSkills = skills.filter((s) => 
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const skillsByCategory = filteredSkills.reduce<Record<string, any[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const catLabels: Record<string, string> = {
    language: "Lenguajes",
    framework: "Frameworks",
    tool: "Herramientas",
    cloud: "Cloud",
    database: "Bases de datos",
    methodology: "Metodologías",
    soft: "Otras",
  };

  const levelNames: Record<number, string> = {
    1: "Básico",
    2: "Intermedio-Bajo",
    3: "Intermedio",
    4: "Avanzado",
    5: "Experto"
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 relative">
      <h1 className="font-display text-3xl font-bold text-gray-900">Mi perfil</h1>
      <p className="mt-1 text-gray-600">Cuéntanos sobre ti para personalizar tu roadmap.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        
       
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-gray-900">Información personal</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Nombre completo">
              <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required disabled className="bg-gray-50 text-gray-500" />
            </Field>
            <Field label="Universidad">
              <Input value={form.university} onChange={(e) => update("university", e.target.value)} placeholder="Ej: PUCP, UNI, UPC" />
            </Field>
            <Field label="Carrera">
              <Input value={form.career} onChange={(e) => update("career", e.target.value)} />
            </Field>
            
            {/* Ciclo actual */}
            <Field label="Ciclo actual">
              <Select value={form.cycle} onValueChange={(v) => update("cycle", v || "")}>
                <SelectTrigger className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <SelectValue placeholder="Selecciona tu ciclo" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-white text-popover-foreground shadow-xl z-50">
                  {["7", "8", "9", "10", "egresado"].map((c) => (
                    <SelectItem key={c} value={c} className="cursor-pointer px-3 py-2 text-sm focus:bg-accent focus:text-accent-foreground">
                      {c === "egresado" ? "Egresado" : `${c}° ciclo`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

           
            <Field label="Objetivo profesional">
              <Select value={form.targetRoleId} onValueChange={(v) => update("targetRoleId", v || "")}>
                <SelectTrigger className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-white text-popover-foreground shadow-xl z-50">
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="cursor-pointer px-3 py-2 text-sm focus:bg-accent focus:text-accent-foreground">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>

        
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-gray-900">Preferencia de Estudio y Disponibilidad</h2>
            <p className="mt-1 text-sm text-gray-600">Ajusta tu ritmo de aprendizaje y el formato en el que prefieres estudiar.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Horas disponibles por semana">
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={form.availabilityHours || 10}
                  onChange={(e) => update("availabilityHours", Number(e.target.value))}
                  className="flex-1 accent-primary cursor-pointer"
                />
                <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                  {form.availabilityHours || 10}h / sem
                </span>
              </div>
            </Field>

            {/* Plazo objetivo */}
            <Field label="Plazo objetivo para tu meta">
              <Select
                value={String(form.targetMonths || 6)}
                onValueChange={(v) => update("targetMonths", Number(v))}
              >
                <SelectTrigger className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-white text-popover-foreground shadow-xl z-50">
                  <SelectItem value="3" className="cursor-pointer px-3 py-2 text-sm focus:bg-accent focus:text-accent-foreground">3 meses (Intensivo)</SelectItem>
                  <SelectItem value="6" className="cursor-pointer px-3 py-2 text-sm focus:bg-accent focus:text-accent-foreground">6 meses (Recomendado)</SelectItem>
                  <SelectItem value="12" className="cursor-pointer px-3 py-2 text-sm focus:bg-accent focus:text-accent-foreground">12 meses (Flexible)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Meta profesional corta">
            <Input
              value={form.goal || ""}
              onChange={(e) => update("goal", e.target.value)}
              placeholder="Ej: Conseguir mis primeras prácticas pre-profesionales"
            />
          </Field>

          <Field label="Formatos de aprendizaje preferidos">
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: "video", label: "📺 Videos / clases" },
                { id: "lectura", label: "📖 Lectura / docs" },
                { id: "practica", label: "🛠️ Práctica hands-on" },
                { id: "comunidad", label: "👥 Comunidad / mentoría" },
              ].map((fmt) => {
                const active = (form.learningPreferences || []).includes(fmt.id as any);
                return (
                  <button
                    type="button"
                    key={fmt.id}
                    onClick={() => {
                      const current = form.learningPreferences || [];
                      const updated = active
                        ? current.filter((x) => x !== fmt.id)
                        : [...current, fmt.id as any];
                      update("learningPreferences", updated);
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      active
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-primary/50"
                    }`}
                  >
                    {fmt.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </section>

        
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-gray-900">Mis habilidades técnicas</h2>
              <p className="mt-1 text-sm text-gray-600">Busca y califica tu nivel del 1 (Básico) al 5 (Experto).</p>
            </div>
            <Badge variant="secondary" className="w-fit bg-primary/10 text-primary font-semibold px-3 py-1">
              {form.skills.length} seleccionadas
            </Badge>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar tecnología o herramienta (ej: React, Python, Docker)..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="pl-9 bg-gray-50/50 border-gray-200"
            />
          </div>

          <div className="mt-6 space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {Object.entries(skillsByCategory).length === 0 ? (
              <p className="text-center py-8 text-sm text-gray-500">No se encontraron tecnologías con ese nombre.</p>
            ) : (
              Object.entries(skillsByCategory).map(([cat, list]) => (
                <div key={cat} className="border-b border-gray-100 pb-5 last:border-0">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">{catLabels[cat] || cat}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {list.map((s) => {
                      const current = form.skills.find((x) => x.skillId === s.slug);
                      const currentLevel = current ? current.level : 0;
                      return (
                        <div
                          key={s.slug}
                          className={`flex items-center justify-between rounded-xl border p-3.5 transition ${
                            current ? "border-primary/50 bg-primary/5 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                            <span className="text-xs text-gray-500">
                              {currentLevel > 0 ? levelNames[currentLevel] : "Sin calificar"}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                            {([1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => {
                              const isActive = current && current.level >= lvl;
                              return (
                                <button
                                  type="button"
                                  key={lvl}
                                  onClick={() => toggleSkill(s.slug, lvl)}
                                  title={`Nivel ${lvl}: ${levelNames[lvl]}`}
                                  className={`h-4 w-4 rounded-full transition-all ${
                                    isActive 
                                      ? "bg-primary scale-110 shadow-sm" 
                                      : "bg-gray-200 hover:bg-gray-300"
                                  }`}
                                  aria-label={`Nivel ${lvl}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link href="/dashboard" className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4 text-sm font-medium">
            Cancelar
          </Link>
          <Button type="submit" className="bg-primary text-white hover:bg-primary/90 px-6 font-semibold">
            Guardar y ver roadmap
          </Button>
        </div>

      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-gray-800 font-medium text-sm">{label}</Label>
      {children}
    </div>
  );
}