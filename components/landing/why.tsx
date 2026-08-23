"use client";

import { BarChart3, Clock, RefreshCw, UserCheck } from "lucide-react";

const WHY_CARDS = [
  {
    title: "Basado en datos reales",
    description: "No opiniones. Vacantes reales actualizadas diariamente.",
    metricIcon: BarChart3,
    metricValue: "15,000+",
    metricLabel: "vacantes",
    accentColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Ahorra 80% de tiempo",
    description: "Ruta optimizada en minutos.",
    metricIcon: Clock,
    metricValue: "12h → 2h",
    metricLabel: "investigación",
    accentColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Siempre actualizado",
    description: "Tu ruta se adapta al mercado.",
    metricIcon: RefreshCw,
    metricValue: "24/7",
    metricLabel: "monitoreo",
    accentColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "100% personalizado",
    description: "Tu carrera, tus objetivos.",
    metricIcon: UserCheck,
    metricValue: "2,500+",
    metricLabel: "rutas únicas",
    accentColor: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export function LandingWhy() {
  return (
    <section id="por-que-smartpath" className="relative bg-[#F8FAFC] text-slate-900 py-20 md:py-28 px-6 overflow-hidden z-10 font-sans border-t border-slate-200/70">
      
      {/* Luz de fondo sutil */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-100/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">

        {/* Encabezado de Sección */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
            <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
              06
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              POR QUÉ SMARTPATH
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight">
            Miles eligen Smartpath{" "}
            <span className="block sm:inline">para transformar su carrera</span>
          </h2>
        </div>

        {/* Grid 2x2 de Bento Cards con Espaciado Generoso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {WHY_CARDS.map((card, i) => {
            const Icon = card.metricIcon;
            return (
              <div
                key={i}
                className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-purple-300/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-[#6E43FF] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl ${card.bgColor} ${card.accentColor} shrink-0 shadow-xs`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 block leading-tight">
                      {card.metricValue}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {card.metricLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
