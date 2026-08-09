"use client";

import React from "react";
import { User, Clock } from "lucide-react";

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
      {/* Title & Subtitle */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-text-primary md:text-4xl">
          Mi Roadmap de <span className="gradient-text">Aprendizaje</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-text-secondary md:text-base">
          Ruta personalizada para{" "}
          <span className="font-bold text-text-primary">{targetRoleLabel}</span>
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Nivel Actual KPI */}
        <div className="surface-card flex items-center gap-3 px-4 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-variant text-primary">
            <User size={20} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-text-secondary">Nivel actual</p>
            <p className="text-sm font-bold text-primary">
              {activeLevelNumber} de {totalLevelsCount}
            </p>
          </div>
        </div>

        {/* Tiempo Estimado KPI */}
        <div className="surface-card flex items-center gap-3 px-4 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-accent">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[11px] font-medium text-text-secondary">Tiempo estimado</p>
            <p className="text-sm font-bold text-accent">
              {estimatedMonths} {estimatedMonths === 1 ? "mes" : "meses"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
