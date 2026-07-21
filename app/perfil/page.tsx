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
import { Loader2 } from "lucide-react";
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
        <h1 className="font-display text-2xl font-bold text-on-surface">Primero inicia sesión</h1>
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

  const skillsByCategory = skills.reduce<Record<string, any[]>>((acc, s) => {
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-on-surface">Mi perfil</h1>
      <p className="mt-1 text-on-surface-variant">Cuéntanos sobre ti para personalizar tu roadmap.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="surface-card p-6 bg-white">
          <h2 className="font-display text-lg font-semibold text-on-surface">Información personal</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Nombre completo">
              <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required disabled />
            </Field>
            <Field label="Universidad">
              <Input value={form.university} onChange={(e) => update("university", e.target.value)} placeholder="Ej: PUCP, UNI, UPC" />
            </Field>
            <Field label="Carrera">
              <Input value={form.career} onChange={(e) => update("career", e.target.value)} />
            </Field>
            <Field label="Ciclo actual">
              <Select value={form.cycle} onValueChange={(v) => update("cycle", v || "")}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["7", "8", "9", "10", "egresado"].map((c) => (
                    <SelectItem key={c} value={c}>{c === "egresado" ? "Egresado" : `${c}° ciclo`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Objetivo profesional">
              <Select value={form.targetRoleId} onValueChange={(v) => update("targetRoleId", v || "")}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>

        <section className="surface-card p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-on-surface">Mis habilidades técnicas</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Selecciona tu nivel en cada tecnología (1 principiante · 5 experto).</p>
            </div>
            <Badge variant="secondary">{form.skills.length} seleccionadas</Badge>
          </div>

          <div className="mt-6 space-y-6">
            {Object.entries(skillsByCategory).map(([cat, list]) => (
              <div key={cat}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-on-surface-variant">{catLabels[cat] || cat}</h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => {
                    const current = form.skills.find((x) => x.skillId === s.slug);
                    return (
                      <div
                        key={s.slug}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${
                          current ? "border-primary bg-primary/5" : "border-outline-variant bg-white"
                        }`}
                      >
                        <span className="text-sm font-medium text-on-surface">{s.name}</span>
                        <div className="flex gap-0.5">
                          {([1, 2, 3, 4, 5] as SkillLevel[]).map((lvl) => (
                            <button
                              type="button"
                              key={lvl}
                              onClick={() => toggleSkill(s.slug, lvl)}
                              className={`h-2 w-2 rounded-full transition ${
                                current && current.level >= lvl ? "bg-primary" : "bg-outline-variant hover:bg-on-surface-variant/40"
                              }`}
                              aria-label={`Nivel ${lvl}`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard" className="inline-flex h-8 items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low px-2.5 text-sm font-medium">
            Cancelar
          </Link>
          <Button type="submit" className="gradient-brand text-white">Guardar y ver roadmap</Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-on-surface font-medium">{label}</Label>
      {children}
    </div>
  );
}
