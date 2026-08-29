"use client";

import Link from "next/link";
import { Building2, Cpu, MonitorPlay, Users, ArrowRight } from "lucide-react";

const KPI_STATS = [
  {
    icon: Building2,
    value: "15,000+",
    label: "vacantes analizadas",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Cpu,
    value: "340+",
    label: "habilidades mapeadas",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: MonitorPlay,
    value: "50+",
    label: "plataformas comparadas",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Users,
    value: "2,500+",
    label: "usuarios activos",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const TOP_SKILLS = [
  { rank: 1, name: "Python", count: 3240, percentage: 96, gradient: "from-[#6E43FF] via-[#8B5CF6] to-[#FF7A45]" },
  { rank: 2, name: "Docker", count: 2890, percentage: 85, gradient: "from-[#6E43FF] via-[#A855F7] to-[#FF7A45]" },
  { rank: 3, name: "AWS", count: 2654, percentage: 78, gradient: "from-[#6E43FF] via-[#C084FC] to-[#FF7A45]" },
  { rank: 4, name: "React", count: 2432, percentage: 72, gradient: "from-[#6E43FF] via-[#D8B4FE] to-[#FF7A45]" },
  { rank: 5, name: "Kubernetes", count: 2108, percentage: 62, gradient: "from-[#6E43FF] via-[#E9D5FF] to-[#FF7A45]" },
];

export function LandingKPIs() {
  return (
    <section id="impacto-real" className="relative bg-white text-slate-900 py-20 md:py-28 px-6 overflow-hidden z-10 font-sans border-t border-slate-100">
      
      {/* Luz ambiental */}
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-14 md:space-y-16">

        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
            <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
              07
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              IMPACTO REAL
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight">
            El mercado tech peruano{" "}
            <span className="block sm:inline">en tiempo real</span>
          </h2>
        </div>

        {/* 4 Métricas Principales en Fila */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {KPI_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200/90 text-center flex flex-col items-center justify-center shadow-xs hover:border-purple-300 transition-all hover:scale-105"
              >
                <div className={`p-3.5 rounded-2xl ${stat.bgColor} ${stat.color} mb-3 shadow-xs`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-none">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-snug">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranking de las 5 Skills más demandadas & CTA */}
        <div className="max-w-3xl mx-auto bg-[#F8FAFC] p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/90 shadow-lg space-y-8">
          
          <div className="text-center sm:text-left">
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
              Las 5 skills más demandadas
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Basado en el análisis de miles de ofertas de trabajo activas en Perú
            </p>
          </div>

          {/* Barras de comparación */}
          <div className="space-y-4">
            {TOP_SKILLS.map((skill) => (
              <div key={skill.rank} className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                
                {/* Posición & Nombre */}
                <div className="w-24 sm:w-28 flex items-center gap-2.5 font-bold text-slate-800 shrink-0">
                  <span className="text-slate-400 text-xs w-4">{skill.rank}</span>
                  <span>{skill.name}</span>
                </div>

                {/* Barra Degradada */}
                <div className="flex-1 h-3.5 bg-slate-200/70 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${skill.gradient} transition-all duration-1000 shadow-xs`}
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>

                {/* Conteo de menciones */}
                <div className="w-12 sm:w-16 text-right font-display font-bold text-slate-700 text-xs sm:text-sm shrink-0">
                  {skill.count.toLocaleString("en-US")}
                </div>

              </div>
            ))}
          </div>

          {/* Caja de Llamado a la Acción */}
          <div className="pt-6 border-t border-slate-200/80 text-center space-y-4">
            <p className="text-sm sm:text-base font-semibold text-slate-800">
              ¿Quieres ver qué skills pide tu puesto soñado?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7A45] to-[#FFA940] text-white font-display font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explorar rutas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}