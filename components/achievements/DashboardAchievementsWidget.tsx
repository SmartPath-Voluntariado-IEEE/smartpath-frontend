"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ACHIEVEMENTS_CATALOG, loadUserAchievements, type UserAchievement } from "@/lib/achievements";
import {
  Trophy,
  Award,
  Target,
  Zap,
  BookOpen,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
  ChevronDown,
  Lock,
} from "lucide-react";

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

export function DashboardAchievementsWidget() {
  const [unlockedList, setUnlockedList] = useState<UserAchievement[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const updateList = () => {
    setUnlockedList(loadUserAchievements());
  };

  useEffect(() => {
    updateList();
    const handler = () => updateList();
    window.addEventListener("smartpath:achievements-updated", handler);
    return () => window.removeEventListener("smartpath:achievements-updated", handler);
  }, []);

  const totalAchievements = ACHIEVEMENTS_CATALOG.length;
  const unlockedCount = unlockedList.length;
  const totalXP = unlockedList.reduce((sum, u) => {
    const ach = ACHIEVEMENTS_CATALOG.find((a) => a.id === u.achievementId);
    return sum + (ach?.xpPoints ?? 0);
  }, 0);

  const percentage = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <section className="surface-card mt-6 rounded-3xl border border-purple-100/80 bg-white/95 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
      {/* SVG DECORATIVO DE FONDO CON GRADIENTE LEVE */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06] select-none"
        aria-hidden="true"
      >
        <svg
          className="absolute -right-16 -top-16 h-80 w-80"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="widget-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E43FF" />
              <stop offset="50%" stopColor="#3D5AFE" />
              <stop offset="100%" stopColor="#FF8A00" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" stroke="url(#widget-brand-grad)" strokeWidth="6" strokeDasharray="12 12" />
          <path
            d="M70 100L90 120L135 75"
            stroke="url(#widget-brand-grad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="45" cy="50" r="12" fill="url(#widget-brand-grad)" />
          <circle cx="160" cy="140" r="16" fill="url(#widget-brand-grad)" />
          <polygon points="100,20 108,36 126,36 112,46 117,62 100,52 83,62 88,46 74,36 92,36" fill="url(#widget-brand-grad)" />
        </svg>

        <svg
          className="absolute -left-20 -bottom-20 h-72 w-72"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 180 Q 70 80, 180 60 T 200 190"
            stroke="url(#widget-brand-grad)"
            strokeWidth="4"
            fill="none"
          />
          <circle cx="60" cy="120" r="8" fill="url(#widget-brand-grad)" />
          <circle cx="130" cy="90" r="6" fill="url(#widget-brand-grad)" />
        </svg>
      </div>

      {/* CABECERA / ACCORDION TRIGGER */}
      <div className="relative z-10 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-[260px] group"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-primary text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                  Tus Logros e Insignias
                </h2>
                <span className="rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/60 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 shadow-2xs">
                  {totalXP} XP
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Has desbloqueado <span className="font-semibold text-gray-800">{unlockedCount} de {totalAchievements}</span> medallas en tu camino de aprendizaje.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/perfil#logros"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white/90 px-3.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white hover:border-primary shadow-2xs transition-all"
            >
              Ver vitrina <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Ocultar detalles de logros" : "Ver detalles de logros"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white/90 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-2xs"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* BARRA DE PROGRESO Y MINI PREVIEWS */}
        <div className="mt-4 pt-3.5 border-t border-gray-100/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-primary" /> Progreso de Gamificación
              </span>
              <span className="text-primary font-bold">{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full gradient-brand transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Mini lista de medallas ganadas / bloqueadas */}
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            {ACHIEVEMENTS_CATALOG.slice(0, 6).map((ach) => {
              const isUnlocked = unlockedList.some((u) => u.achievementId === ach.id);
              const Icon = ICON_MAP[ach.iconName] || Trophy;

              return (
                <div
                  key={ach.id}
                  title={`${ach.title}: ${ach.description} (${isUnlocked ? "Desbloqueado" : "Bloqueado"})`}
                  className={`grid h-7 w-7 place-items-center rounded-lg border transition-all ${
                    isUnlocked
                      ? "bg-primary/10 border-primary/40 text-primary shadow-xs scale-105"
                      : "bg-gray-50 border-gray-200 text-gray-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CUERPO DEL ACORDEÓN EXPANDIBLE                            */}
      {/* ========================================================= */}
      <div
        className={`transition-all duration-300 ease-in-out border-t border-gray-100 ${
          isOpen
            ? "max-h-[600px] opacity-100 bg-gradient-to-b from-gray-50/60 to-white p-5 md:p-6"
            : "max-h-0 opacity-0 overflow-hidden p-0 border-t-0"
        }`}
      >
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-500" /> Desglose de Medallas
          </h3>
          <span className="text-xs text-gray-500">
            {unlockedCount} obtenidas de {totalAchievements}
          </span>
        </div>

        {/* Grid de Medallas en el Acordeón */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS_CATALOG.map((ach) => {
            const isUnlocked = unlockedList.some((u) => u.achievementId === ach.id);
            const Icon = ICON_MAP[ach.iconName] || Trophy;

            return (
              <div
                key={ach.id}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-all ${
                  isUnlocked
                    ? "border-purple-200/80 bg-white shadow-xs"
                    : "border-gray-200/60 bg-gray-50/70 opacity-70"
                }`}
              >
                <div
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-xs ${
                    isUnlocked
                      ? "bg-gradient-to-br from-[#6E43FF] to-[#FF8A00] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isUnlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-gray-900 truncate">{ach.title}</h4>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                      +{ach.xpPoints} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {ach.description}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold ${
                      isUnlocked ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {isUnlocked ? "✓ Desbloqueado" : "Pendiente"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
