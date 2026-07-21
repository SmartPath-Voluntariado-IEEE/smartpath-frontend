import { COURSES, type Course } from "./smartpath-data";

export interface AICourse {
  title: string;
  platform: string;
  url: string;
  price: string;
  rating: number;
  hours: number;
  level: "Básico" | "Intermedio" | "Avanzado";
  style: string; // video, práctica, lectura, etc
  why: string;
}

export interface RecommendCoursesInput {
  skillId: string;
  skillName: string;
  userLevel: number;
  availabilityHours: number;
  learningPreferences: string[];
  targetRole: string;
}

// Mock temporal que filtra cursos estáticos del catálogo según la entrada del usuario
export async function recommendCourses(data: RecommendCoursesInput): Promise<{ courses: AICourse[] }> {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  const matched = COURSES.filter((c: Course) => c.skillIds && c.skillIds.includes(data.skillId));
  
  if (matched.length === 0) {
    return { courses: [] };
  }

  const courses: AICourse[] = matched.map((c: Course) => ({
    title: c.title,
    platform: c.platform,
    url: c.url,
    price: c.price,
    rating: c.rating,
    hours: c.hours,
    level: c.level,
    style: data.learningPreferences.length > 0 ? data.learningPreferences[0] : "video",
    why: `Curso ideal para comenzar con ${data.skillName} enfocado en tu objetivo de ${data.targetRole || "Desarrollador"}.`
  }));

  return { courses };
}
