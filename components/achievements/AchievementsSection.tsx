"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS_CATALOG, loadUserAchievements, type UserAchievement } from "@/lib/achievements";
import { Trophy, Award, Target, Zap, BookOpen, Flame, CheckCircle2, Lock, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, any> = {
  Target,
  Award,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  CheckCircle2,
  Star,
};

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  purple: {
    bg: "bg-purple-50 text-purple-600",
    text: "text-purple-600",
    border: "border-purple-200",
    glow: "shadow-purple-100",
  },
  emerald: {
    bg: "bg-emerald-50 text-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-200",
    glow: "shadow-emerald-100",
  },
  amber: {
    bg: "bg-amber-50 text-amber-600",
    text: "text-amber-600",
    border: "border-amber-200",
    glow: "shadow-amber-100",
  },
  indigo: {
    bg: "bg-indigo-50 text-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-200",
    glow: "shadow-indigo-100",
  },
  orange: {
    bg: "bg-orange-50 text-orange-600",
    text: "text-orange-600",
    border: "border-orange-200",
    glow: "shadow-orange-100",
  },
};

export function AchievementsSection() {
  const [unlockedMap, setUnlockedMap] = useState<Record<string, UserAchievement>>({});

  const refreshAchievements = () => {
    const list = loadUserAchievements();
    const map: Record<string, UserAchievement> = {};
    for (const item of list) {
      map[item.achievementId] = item;
    }
    setUnlockedMap(map);
  };

  useEffect(() => {
    refreshAchievements();

    const handler = () => refreshAchievements();
    window.addEventListener("smartpath:achievements-updated", handler);
    return () => window.removeEventListener("smartpath:achievements-updated", handler);
  }, []);

  const totalAchievements = ACHIEVEMENTS_CATALOG.length;
  const unlockedCount = Object.keys(unlockedMap).length;
  const totalXP = Object.keys(unlockedMap).reduce((sum, id) => {
    const ach = ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
    return sum + (ach?.xpPoints ?? 0);
  }, 0);

  const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <section id="logros" className="surface-card p-6 md:p-8 scroll-mt-20 transition-all rounded-3xl border border-gray-100 bg-white shadow-sm">
      {/* Encabezado del Medallero */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-600 shadow-2xs">
              <Trophy className="h-5 w-5" />
            </span>
            <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">
              Vitrina de Logros y Medallas
            </h2>
          </div>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            Hitos e insignias desbloqueadas conforme completas módulos, exámenes y avanzas en tu ruta.
          </p>
        </div>

        {/* Resumen de XP y Contador */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-2 text-center shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Experiencia</p>
            <p className="font-display text-lg font-bold text-gray-900">{totalXP} XP</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-2 text-center shadow-2xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Insignias</p>
            <p className="font-display text-lg font-bold text-gray-900">
              {unlockedCount} / {totalAchievements}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de progreso global de logros */}
      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Progreso del medallero
          </span>
          <span className="text-primary font-bold">{progressPercentage}% Completado</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full gradient-brand transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Grid de Medallas */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS_CATALOG.map((ach) => {
          const userAch = unlockedMap[ach.id];
          const isUnlocked = !!userAch;
          const IconComponent = ICON_MAP[ach.iconName] || Trophy;
          const color = COLOR_CLASSES[ach.badgeColor] || COLOR_CLASSES.purple;

          return (
            <div
              key={ach.id}
              className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all ${
                isUnlocked
                  ? "border-gray-200 bg-white shadow-xs hover:shadow-md hover:border-primary/40"
                  : "border-dashed border-gray-200 bg-gray-50/60 opacity-75"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Icono de la Insignia */}
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-transform ${
                    isUnlocked
                      ? `${color.bg} ${color.border} shadow-xs scale-105`
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {isUnlocked ? (
                    <IconComponent className="h-6 w-6" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                {/* Contenido */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-display font-bold text-sm leading-snug ${isUnlocked ? "text-gray-900" : "text-gray-600"}`}>
                      {ach.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-bold shrink-0 rounded-lg px-2 py-0.5 ${
                        isUnlocked ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      +{ach.xpPoints} XP
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                    {ach.description}
                  </p>

                  {/* Estado / Fecha */}
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        {userAch.unlockedAt ? new Date(userAch.unlockedAt).toLocaleDateString() : "Completado"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-gray-400">
                        <Lock className="h-3 w-3" /> Bloqueado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
