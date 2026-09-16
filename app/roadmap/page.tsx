"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { 
  getGapAnalysis, 
  getRoadmap, 
  getCatalogRoles, 
  getUserSkillProgress,
  getDashboardCourseProgress,
  type CourseProgressSummary,
} from "@/services/api";
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader";
import { LevelRow } from "@/components/roadmap/LevelRow";
import { RoadmapDetailSection } from "@/components/roadmap/RoadmapDetailSection";
import { SkillMarketModal } from "@/components/roadmap/SkillMarketModal";
import type { RoadmapLevel, GapAnalysis, RoadmapSkill } from "@/types/roadmap";

import { RoadmapSkeleton } from "@/components/skeletons";

export default function RoadmapPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated } = useProfile();

  const [loadingData, setLoadingData] = useState(true);
  const [gap, setGap] = useState<GapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapLevel[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [skillProgress, setSkillProgress] = useState<Record<string, any>>({});
  const [activeCourses, setActiveCourses] = useState<CourseProgressSummary[]>([]);

  const [marketModalSkill, setMarketModalSkill] = useState<{
    skill: RoadmapSkill;
    isCore: boolean;
    activeCourse?: CourseProgressSummary | null;
  } | null>(null);

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [gapData, roadmapData, rolesData, progressData, activeCoursesData] = await Promise.all([
          getGapAnalysis(session.access_token),
          getRoadmap(session.access_token),
          getCatalogRoles(),
          getUserSkillProgress(session.access_token).catch(() => ({})),
          getDashboardCourseProgress(session.access_token).catch(() => []),
        ]);
        setGap(gapData);
        setRoadmap(roadmapData);
        setRoles(rolesData);
        setSkillProgress(progressData);
        setActiveCourses(activeCoursesData || []);
      } catch (err) {
        console.error("Error al cargar datos del roadmap:", err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [session]);

  const loading = !hydrated || authLoading || loadingData;

  if (loading) {
    return <RoadmapSkeleton />;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-text-primary">Crea tu perfil primero</h1>
        <Link
          href="/login"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Empezar
        </Link>
      </div>
    );
  }

  const targetRole = roles.find((r) => r.id === profile.targetRoleId) ?? roles[0];
  if (!gap || !roadmap || !targetRole) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-text-secondary">Cargando análisis de perfil...</p>
      </div>
    );
  }

  const handleOpenMarketModal = (skill: RoadmapSkill, isCore?: boolean) => {
    const coreSlugs = new Set(gap.target_role?.core_skill_slugs || []);
    const userActiveCourse =
      activeCourses.find(
        (c) =>
          c.skill_slug?.toLowerCase().trim() === skill.skill_slug?.toLowerCase().trim() &&
          Boolean(c.course_id)
      ) || null;
    setMarketModalSkill({
      skill,
      isCore: isCore ?? coreSlugs.has(skill.skill_slug),
      activeCourse: userActiveCourse,
    });
  };

  const totalHours = roadmap.reduce(
    (acc, lvl) => acc + lvl.skills.reduce((sum, s) => sum + s.estHours, 0),
    0
  );
  const weeklyHours = profile.availabilityHours || 10;
  const targetMonths = profile.targetMonths || 6;
  const estimatedWeeks = Math.ceil(totalHours / weeklyHours);
  const estimatedMonths = Math.max(1, Math.ceil(estimatedWeeks / 4.33));

  const activeLevelObj = roadmap.find((lvl) => {
    return lvl.skills.some((s) => !gap.mastered.some((m) => m.skill_slug === s.skill_slug));
  }) || roadmap[0];

  const activeLevelNumber = activeLevelObj ? activeLevelObj.level : 1;
  const totalLevelsCount = roadmap.length > 0 ? roadmap.length : 5;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-10">
      <div data-tour="roadmap-header">
        <RoadmapHeader
          targetRoleLabel={targetRole.label}
          activeLevelNumber={activeLevelNumber}
          totalLevelsCount={totalLevelsCount}
          estimatedMonths={targetMonths || estimatedMonths}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
            Ruta por niveles
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Avanza paso a paso dominando cada bloque de competencias técnicas.
          </p>
        </div>
      </div>

      {roadmap.length === 0 ? (
        <div className="surface-card p-10 text-center bg-white">
          <h3 className="font-display text-xl font-bold text-text-primary">
            ¡Ya dominas todo lo necesario! 🎉
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            Considera explorar habilidades avanzadas o roles distintos en tu perfil.
          </p>
        </div>
      ) : (
        <div data-tour="roadmap-timeline" className="mt-6">
          {roadmap.map((lvl, index) => (
            <LevelRow
              key={lvl.level}
              level={lvl}
              levelIndex={index}
              totalLevels={roadmap.length}
              isCurrentLevel={lvl.level === activeLevelNumber}
              gap={gap}
              activeCourses={activeCourses}
              skillProgress={skillProgress}
              defaultExpanded={true}
              onOpenMarketModal={(skill) => handleOpenMarketModal(skill)}
            />
          ))}
        </div>
      )}

      <RoadmapDetailSection
        roadmap={roadmap}
        gap={gap}
        targetRoleLabel={targetRole.label}
        onSelectSkillForMarket={(skill, isCore) => handleOpenMarketModal(skill, isCore)}
        skillProgress={skillProgress}
      />

      <SkillMarketModal
        isOpen={Boolean(marketModalSkill)}
        onClose={() => setMarketModalSkill(null)}
        skill={marketModalSkill?.skill ?? null}
        isCore={marketModalSkill?.isCore ?? false}
        targetRoleLabel={targetRole.label}
        activeCourse={marketModalSkill?.activeCourse}
      />
    </div>
  );
}