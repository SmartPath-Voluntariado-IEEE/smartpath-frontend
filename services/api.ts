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
  let academicCycleNum = 10;
  if (profile.cycle) {
    const match = profile.cycle.match(/\d+/);
    if (match) {
      academicCycleNum = parseInt(match[0], 10);
    }
  }

  const payload = {
    full_name: profile.fullName || undefined,
    career: profile.career || undefined,
    academic_cycle: academicCycleNum,
    target_role_id: profile.targetRoleId || undefined,
    weekly_hours: profile.availabilityHours || 10, // HU2: Horas por semana disponibles
    target_months: profile.targetMonths || 6, // HU3: Plazo objetivo en meses
    professional_goal: profile.goal || undefined, // HU3: Meta profesional
    experience_level: Array.isArray(profile.experience) ? profile.experience.join(", ") : (profile.experience || undefined),
    interests: profile.interests || [],
    learning_preferences: profile.learningPreferences || [], // HU1: Formatos de aprendizaje preferidos
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