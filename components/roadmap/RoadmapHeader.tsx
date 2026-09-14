"use client";

import React from "react";

interface RoadmapHeaderProps {
  targetRoleLabel: string;
  activeLevelNumber: number;
  totalLevelsCount: number;
  estimatedMonths: number;
}

export function RoadmapHeader({
  targetRoleLabel,
  activeLevelNumber,
  totalLevelsCount,
  estimatedMonths,
}: RoadmapHeaderProps) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-start">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-text-primary md:text-4xl">
          Mi Roadmap de <span className="gradient-text">Aprendizaje</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-text-secondary md:text-base">
          Ruta personalizada para{" "}
          <span className="font-bold text-text-primary">{targetRoleLabel}</span>
        </p>
      </div>

    </header>
  );
}
