// Tipos e Interfaces globales para SmartPath
export type SkillCategory = "language" | "framework" | "tool" | "cloud" | "database" | "soft" | "methodology";
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  aliases?: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  seniority: "Practicante" | "Junior" | "Semi Senior" | "Senior";
  salary?: string;
  description: string;
  postedAt: string;
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  skillIds: string[];
  hours: number;
  price: string;
  rating: number;
  level: "Básico" | "Intermedio" | "Avanzado";
  url: string;
}

export interface RoleTarget {
  id: string;
  label: string;
  coreSkills: string[];
}

export const COURSES: Course[] = [];
