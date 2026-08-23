"use client";

import { CheckCircle2 } from "lucide-react";

export function LandingInsight() {
  return (
    <section id="insight" className="relative bg-white text-slate-900 py-16 md:py-24 px-6 overflow-hidden z-10 font-sans border-t border-slate-100">
      
      {/* Orbes ambientales sutiles */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-32 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* COLUMNA IZQUIERDA: Badge, Titular, Descripción, Grid 2x2 y Cierre */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Badge 03 INSIGHT */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
              <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
                03
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                INSIGHT
              </span>
            </div>

            {/* Titular en 2 tonos */}
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.18] tracking-tight">
              <span className="text-[#6E43FF] block">
                El problema no es el exceso de información...
              </span>
              <span className="text-slate-900 block mt-1">
                ...es la falta de dirección basada en datos
              </span>
            </h2>

            {/* Párrafo explicativo */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Las empresas peruanas buscan skills específicos. Python, Docker, AWS. Pero no todas tienen la misma demanda.
            </p>

            {/* Grid 2x2 de Soluciones con Checks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              {/* Card 1 */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:border-purple-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold text-slate-800 leading-snug">
                  Qué tecnologías piden HOY
                </span>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:border-purple-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold text-slate-800 leading-snug">
                  Cuáles tienen mayor crecimiento
                </span>
              </div>

              {/* Card 3 */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:border-purple-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold text-slate-800 leading-snug">
                  Qué orden de aprendizaje es óptimo
                </span>
              </div>

              {/* Card 4 */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:border-purple-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  ✓
                </div>
                <span className="text-sm font-semibold text-slate-800 leading-snug">
                  Dónde estudiar cada habilidad
                </span>
              </div>

            </div>

            {/* Cierre enfático */}
            <div className="pt-3">
              <p className="font-display font-extrabold text-slate-900 text-lg md:text-xl tracking-tight">
                Eso es exactamente lo que hacemos.
              </p>
            </div>

          </div>

          {/* COLUMNA DERECHA: Ilustración del embudo/funnel de transformación (insights.png) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg flex items-center justify-center">
              <img
                src="/img/landing/insights.png"
                alt="SmartPath Insight: Del caos a una ruta clara basada en datos"
                className="w-full max-w-md md:max-w-lg h-auto object-contain drop-shadow-xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
