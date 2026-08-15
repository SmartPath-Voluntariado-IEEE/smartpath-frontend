export interface RoadmapSkill {
  skill_slug: string;
  name: string;
  marketFreq: number;
  estHours: number;
  /** Score de priorización del backend: demanda, brecha, cursos e intereses. */
  priority: number;
  courseCount: number;
  freeCourseCount: number;
}

export interface RoadmapLevel {
  level: number;
  label: string;
  skills: RoadmapSkill[];
  estHours: number;
  cumulativeHours: number;
  estimatedWeeks: number;
  /** false cuando el nivel se sale del plazo declarado por el usuario. */
  withinTarget: boolean;
}

export interface GapSkill {
  skill_slug: string;
  name: string;
  level?: number;
  marketFreq: number;
  priority?: number;
}

export interface GapAnalysis {
  target_role: {
    id: string;
    label: string;
    core_skill_slugs: string[];
  };
  mastered: GapSkill[];
  partial: GapSkill[];
  missing: GapSkill[];
  coverage: number;
}
