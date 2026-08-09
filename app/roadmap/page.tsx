"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getGapAnalysis, getRoadmap, getCatalogRoles, getCatalogCourses } from "@/services/api";
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader";
import { LevelRow } from "@/components/roadmap/LevelRow";
import type { RoadmapLevel, GapAnalysis } from "@/types/roadmap";

export default function RoadmapPage() {
  const { session, loading: authLoading } = useRequireAuth();
  const { profile, hydrated } = useProfile();

  const [loadingData, setLoadingData] = useState(true);
  const [gap, setGap] = useState<GapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapLevel[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [gapData, roadmapData, rolesData, coursesData] = await Promise.all([
          getGapAnalysis(session.access_token),
          getRoadmap(session.access_token),
          getCatalogRoles(),
          getCatalogCourses(),
        ]);
        setGap(gapData);
        setRoadmap(roadmapData);
        setRoles(rolesData);
        setCourses(coursesData);
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
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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

  const totalHours = roadmap.reduce(
    (acc, lvl) => acc + lvl.skills.reduce((sum, s) => sum + s.estHours, 0),
    0
  );
  const weeklyHours = profile.availabilityHours || 10;
  const targetMonths = profile.targetMonths || 6;
  const estimatedWeeks = Math.ceil(totalHours / weeklyHours);
  const estimatedMonths = Math.max(1, Math.ceil(estimatedWeeks / 4.33));

  // Determine active level number (the first level with unmastered skills, default to level 1)
  const activeLevelObj = roadmap.find((lvl) => {
    return lvl.skills.some((s) => !gap.mastered.some((m) => m.skill_slug === s.skill_slug));
  }) || roadmap[0];

  const activeLevelNumber = activeLevelObj ? activeLevelObj.level : 1;
  const totalLevelsCount = roadmap.length > 0 ? roadmap.length : 5;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      {/* Roadmap Header with Title & KPI Cards */}
      <RoadmapHeader
        targetRoleLabel={targetRole.label}
        activeLevelNumber={activeLevelNumber}
        totalLevelsCount={totalLevelsCount}
        estimatedMonths={targetMonths || estimatedMonths}
      />

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
          Ruta por niveles
        </h2>
      </div>

      {/* Roadmap Levels List */}
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
        <div className="mt-6">
          {roadmap.map((lvl, index) => (
            <LevelRow
              key={lvl.level}
              level={lvl}
              levelIndex={index}
              totalLevels={roadmap.length}
              isCurrentLevel={lvl.level === activeLevelNumber}
              gap={gap}
              courses={courses}
              defaultExpanded={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
