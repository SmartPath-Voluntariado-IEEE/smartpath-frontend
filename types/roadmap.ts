export interface RoadmapSkill {
  skill_slug: string;
  name: string;
  marketFreq: number;
  estHours: number;
}

export interface RoadmapLevel {
  level: number;
  label: string;
  skills: RoadmapSkill[];
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
