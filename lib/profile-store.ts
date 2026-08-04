import type { SkillLevel } from "./smartpath-data";

export type LearningPreference = "video" | "lectura" | "practica" | "comunidad";
export type ExperienceKind = "personal" | "cursos" | "practicas" | "laboral" | "ninguna";

export interface UserProfile {
  fullName: string;
  email: string;
  university: string;
  career: string;
  cycle: string; // "8", "9", "10"
  isGraduated: boolean; // HU-29: el usuario ya egresó, no cursa un ciclo
  availabilityHours: number; // weekly_hours
  goal: string; // professional_goal

  // Campos locales / mock (sincronización a futuro)
  targetRoleId: string;
  interests: string[];
  experience: ExperienceKind[];
  learningPreferences: LearningPreference[];
  languages: string[];
  certifications: string[];
  skills: { skillId: string; level: SkillLevel }[];
  onboardingComplete: boolean;
  createdAt: string;
}

const KEY = "smartpath.profile.v1";

export const defaultProfile: UserProfile = {
  fullName: "",
  email: "",
  university: "",
  career: "Ingeniería de Sistemas",
  cycle: "9",
  isGraduated: false,
  targetRoleId: "fullstack",
  interests: [],
  experience: [],
  learningPreferences: [],
  availabilityHours: 10,
  goal: "",
  languages: ["Español"],
  certifications: [],
  skills: [],
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
};

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return { ...defaultProfile, ...parsed } as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("smartpath:profile-updated"));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("smartpath:profile-updated"));
}
