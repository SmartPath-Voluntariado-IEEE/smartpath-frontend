export type AchievementCategory = "modules" | "quizzes" | "courses" | "roadmap" | "streak" | "general";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  iconName: "Target" | "Award" | "Trophy" | "Flame" | "Zap" | "BookOpen" | "CheckCircle2" | "Star";
  badgeColor: "purple" | "emerald" | "amber" | "indigo" | "orange";
  criteriaType: string;
  criteriaValue: number;
  xpPoints: number;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  metadata?: Record<string, any>;
}

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: "first-module-passed",
    title: "Primer Paso",
    description: "Aprueba tu primera evaluación de módulo con éxito.",
    category: "modules",
    iconName: "Target",
    badgeColor: "purple",
    criteriaType: "passed_modules_count",
    criteriaValue: 1,
    xpPoints: 50,
  },
  {
    id: "perfect-score",
    title: "Puntaje Perfecto",
    description: "Obtén una calificación perfecta del 100% (10/10) en un test.",
    category: "quizzes",
    iconName: "Award",
    badgeColor: "emerald",
    criteriaType: "perfect_score",
    criteriaValue: 1,
    xpPoints: 100,
  },
  {
    id: "three-modules-passed",
    title: "Explorador Imparable",
    description: "Completa 3 módulos evaluados satisfactoriamente.",
    category: "modules",
    iconName: "Zap",
    badgeColor: "indigo",
    criteriaType: "passed_modules_count",
    criteriaValue: 3,
    xpPoints: 150,
  },
  {
    id: "course-completed",
    title: "Curso Conquistado",
    description: "Aprueba todos los módulos de un curso activo.",
    category: "courses",
    iconName: "BookOpen",
    badgeColor: "amber",
    criteriaType: "completed_course",
    criteriaValue: 1,
    xpPoints: 200,
  },
  {
    id: "level-1-mastered",
    title: "Fundamentos Dominados",
    description: "Domina todas las habilidades clave del Nivel 1 en tu Roadmap.",
    category: "roadmap",
    iconName: "Trophy",
    badgeColor: "orange",
    criteriaType: "level_completed",
    criteriaValue: 1,
    xpPoints: 300,
  },
  {
    id: "streak-active",
    title: "Hábito de Hierro",
    description: "Mantén una racha de estudio activa en la plataforma.",
    category: "streak",
    iconName: "Flame",
    badgeColor: "orange",
    criteriaType: "streak_days",
    criteriaValue: 3,
    xpPoints: 100,
  },
];

const STORAGE_KEY = "smartpath.achievements.v1";

export function loadUserAchievements(): UserAchievement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error al cargar logros locales:", e);
    return [];
  }
}

export function saveUserAchievements(achievements: UserAchievement[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    window.dispatchEvent(new CustomEvent("smartpath:achievements-updated", { detail: achievements }));
  } catch (e) {
    console.error("Error al guardar logros locales:", e);
  }
}

export interface AchievementEvaluationContext {
  passedModulesCount: number;
  lastQuizScore?: number; // 0 to 100
  hasCompletedCourse?: boolean;
  level1Completed?: boolean;
  streakDays?: number;
}

/**
 * Evalúa el estado del usuario contra los criterios de logros
 * y retorna los logros recién desbloqueados en esta llamada.
 */
export function evaluateAndUnlockAchievements(context: AchievementEvaluationContext): Achievement[] {
  const current = loadUserAchievements();
  const unlockedIds = new Set(current.map((a) => a.achievementId));
  const newlyUnlocked: Achievement[] = [];
  const updatedList = [...current];

  function unlock(achId: string, metadata: Record<string, any> = {}) {
    if (!unlockedIds.has(achId)) {
      const ach = ACHIEVEMENTS_CATALOG.find((a) => a.id === achId);
      if (ach) {
        unlockedIds.add(achId);
        newlyUnlocked.push(ach);
        updatedList.push({
          achievementId: achId,
          unlockedAt: new Date().toISOString(),
          metadata,
        });
      }
    }
  }

  // 1. Primer Paso
  if (context.passedModulesCount >= 1) {
    unlock("first-module-passed", { count: context.passedModulesCount });
  }

  // 2. Puntaje Perfecto
  if (context.lastQuizScore === 100) {
    unlock("perfect-score", { score: 100 });
  }

  // 3. Tres módulos aprobados
  if (context.passedModulesCount >= 3) {
    unlock("three-modules-passed", { count: context.passedModulesCount });
  }

  // 4. Curso Conquistado
  if (context.hasCompletedCourse) {
    unlock("course-completed");
  }

  // 5. Nivel 1 Dominado
  if (context.level1Completed) {
    unlock("level-1-mastered");
  }

  // 6. Racha de estudio
  if ((context.streakDays ?? 0) >= 3) {
    unlock("streak-active", { streakDays: context.streakDays });
  }

  if (newlyUnlocked.length > 0) {
    saveUserAchievements(updatedList);
  }

  return newlyUnlocked;
}
