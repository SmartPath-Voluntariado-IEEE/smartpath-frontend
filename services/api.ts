import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import type { UserProfile } from "@/lib/profile-store";

import { supabase } from "@/lib/supabaseClient";

export const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/auth/callback")) {
          console.warn("Sesión expirada o token inválido (401). Redirigiendo al login...");
          localStorage.removeItem("access_token");
          await supabase.auth.signOut({ scope: "local" }).catch(() => {});
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

function getAuthHeader(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getBackendProfile(token: string): Promise<any> {
  try {
    const response = await api.get("/users/profile", getAuthHeader(token));
    return response.data;
  } catch (err: any) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function upsertBackendProfile(token: string, profile: UserProfile): Promise<any> {
  // El backend acepta ciclos de 1 a 12 y deja academic_cycle en null si el
  // usuario ya egresó. No mandamos un ciclo inventado: el upsert ignora los
  // campos ausentes, así que omitirlo conserva lo que guardó el chatbot.
  let academicCycle: number | undefined;
  if (!profile.isGraduated && profile.cycle) {
    const match = profile.cycle.match(/\d+/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      if (parsed >= 1 && parsed <= 12) academicCycle = parsed;
    }
  }

  // experience_level es la etapa académica de la HU-29 ("Egresado" / "Ciclo N"),
  // que es de donde el chatbot deduce si ya respondió ese paso. Los tipos de
  // experiencia del formulario largo viven solo en el perfil local.
  const academicStage = profile.isGraduated
    ? "Egresado"
    : academicCycle
      ? `Ciclo ${academicCycle}`
      : undefined;

  const payload = {
    full_name: profile.fullName || undefined,
    career: profile.career || undefined,
    academic_cycle: academicCycle,
    target_role_id: profile.targetRoleId || undefined,
    weekly_hours: profile.availabilityHours || 10,
    professional_goal: profile.goal || undefined,
    experience_level: academicStage,
    interests: profile.interests || [],
    learning_preferences: profile.learningPreferences || [],
    skills: (profile.skills || [])
      .filter((s) => s.level > 0)
      .map((s) => ({
        skill_slug: s.skillId,
        level: Number(s.level),
      })),
  };

  const response = await api.post("/users/profile", payload, getAuthHeader(token));
  return response.data;
}

// ============================================
// CHATBOT DE ONBOARDING (HU-29, HU-30, HU-31)
// ============================================

export type OnboardingStepName =
  | "ask_name"
  | "ask_career"
  | "ask_cycle"
  | "ask_interests"
  | "ask_target_role"
  | "completed";

export interface OnboardingOption {
  id: string;
  label: string;
  description?: string;
  core_skill_slugs?: string[];
  match_score?: number;
}

/** Respuesta uniforme de todos los pasos del chatbot (OnboardingStepResponse). */
export interface OnboardingStepResponse {
  step: OnboardingStepName;
  message: string;
  question: string | null;
  options: OnboardingOption[];
  profile: any | null;
}

/** HU-29: saluda y devuelve la primera pregunta pendiente (retoma si ya avanzó). */
export async function startOnboarding(token: string): Promise<OnboardingStepResponse> {
  const response = await api.get("/onboarding/start", getAuthHeader(token));
  return response.data;
}

/** HU-29: guarda el nombre con el que el usuario quiere ser llamado. */
export async function saveOnboardingName(token: string, fullName: string): Promise<OnboardingStepResponse> {
  const response = await api.post("/onboarding/name", { full_name: fullName }, getAuthHeader(token));
  return response.data;
}

/** HU-29: guarda la carrera que estudia o estudió. */
export async function saveOnboardingCareer(token: string, career: string): Promise<OnboardingStepResponse> {
  const response = await api.post("/onboarding/career", { career }, getAuthHeader(token));
  return response.data;
}

/** HU-29: guarda el ciclo académico (1-12) o marca al usuario como egresado. */
export async function saveOnboardingStage(
  token: string,
  stage: { academicCycle?: number; isGraduated?: boolean }
): Promise<OnboardingStepResponse> {
  const payload = {
    academic_cycle: stage.isGraduated ? null : stage.academicCycle ?? null,
    is_graduated: stage.isGraduated ?? false,
  };
  const response = await api.post("/onboarding/stage", payload, getAuthHeader(token));
  return response.data;
}

/** HU-30: áreas de tecnología disponibles. Endpoint público, no requiere token. */
export async function getOnboardingInterestAreas(): Promise<OnboardingOption[]> {
  const response = await api.get("/onboarding/interest-areas");
  return response.data;
}

/** HU-30: guarda las áreas elegidas y devuelve las líneas de carrera sugeridas. */
export async function saveOnboardingInterests(token: string, interestIds: string[]): Promise<OnboardingStepResponse> {
  const response = await api.post("/onboarding/interests", { interest_ids: interestIds }, getAuthHeader(token));
  return response.data;
}

/** HU-31: guarda el rol objetivo elegido y cierra el onboarding conversacional. */
export async function saveOnboardingTargetRole(token: string, targetRoleId: string): Promise<OnboardingStepResponse> {
  const response = await api.post("/onboarding/target-role", { target_role_id: targetRoleId }, getAuthHeader(token));
  return response.data;
}

/**
 * El onboarding conversacional termina cuando hay rol objetivo: es el último dato
 * que pide el chatbot y del que dependen el gap-analysis y el roadmap.
 */
export function isOnboardingComplete(profile: any): boolean {
  return Boolean(profile?.target_role_id);
}

export async function getCatalogSkills(): Promise<any> {
  const response = await api.get("/catalog/skills");
  return response.data;
}

export async function getCatalogJobs(): Promise<any> {
  const response = await api.get("/catalog/jobs");
  return response.data;
}

export async function getCatalogCourses(skillSlug?: string): Promise<any> {
  const params = skillSlug ? { params: { skill: skillSlug } } : {};
  const response = await api.get("/catalog/courses", params);
  return response.data;
}

export async function getCatalogRoles(): Promise<any> {
  const response = await api.get("/catalog/roles");
  return response.data;
}

export async function getGapAnalysis(token: string): Promise<any> {
  const response = await api.get("/users/gap-analysis", getAuthHeader(token));
  return response.data;
}

export async function getRoadmap(token: string): Promise<any> {
  const response = await api.get("/users/roadmap", getAuthHeader(token));
  return response.data;
}

export async function getCourseRecommendations(token: string, skillSlug: string): Promise<any> {
  const response = await api.get("/users/course-recommendations", {
    ...getAuthHeader(token),
    params: { skill: skillSlug },
  });
  return response.data;
}