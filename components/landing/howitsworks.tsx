"use client";

import { useState, useEffect } from "react";
import { Search, Brain, Target, Route, Sparkles } from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Analizamos el mercado",
    description: "Scrapeamos miles de vacantes peruanas 24/7",
    color: {
      badge: "bg-[#7C3AED] text-white",
      ringOuter: "border-purple-200 bg-purple-50/50",
      ringMid: "border-purple-400/40 bg-purple-100/60",
      iconBg: "bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white shadow-purple-500/30",
      line: "from-purple-500 to-blue-500",
    },
    renderCustomIcon: () => (
      <div className="relative flex items-center justify-center">
        {/* Lupa con bandera de Perú */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-md border border-purple-200 relative overflow-hidden">
          <div className="flex items-center w-6 h-4 rounded-xs overflow-hidden shadow-xs">
            <div className="w-2 h-full bg-[#D91023]"></div>
            <div className="w-2 h-full bg-white flex items-center justify-center text-[6px]">🇵🇪</div>
            <div className="w-2 h-full bg-[#D91023]"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-xs">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: "Extraemos habilidades con IA",
    description: "NLP identifica tecnologías en cada oferta",
    color: {
      badge: "bg-[#2563EB] text-white",
      ringOuter: "border-blue-200 bg-blue-50/50",
      ringMid: "border-blue-400/40 bg-blue-100/60",
      iconBg: "bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white shadow-blue-500/30",
      line: "from-blue-500 to-emerald-500",
    },
    renderCustomIcon: () => (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
        <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    ),
  },
  {
    number: 3,
    title: "Detectamos tus brechas",
    description: "Comparamos tu perfil vs mercado real",
    color: {
      badge: "bg-[#059669] text-white",
      ringOuter: "border-emerald-200 bg-emerald-50/50",
      ringMid: "border-emerald-400/40 bg-emerald-100/60",
      iconBg: "bg-gradient-to-br from-[#059669] to-[#10B981] text-white shadow-emerald-500/30",
      line: "from-emerald-500 to-orange-500",
    },
    renderCustomIcon: () => (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#047857] via-[#059669] to-[#34D399] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
        <Target className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    ),
  },
  {
    number: 4,
    title: "Creamos tu ruta personalizada",
    description: "Roadmap + cursos recomendados",
    color: {
      badge: "bg-[#EA580C] text-white",
      ringOuter: "border-orange-200 bg-orange-50/50",
      ringMid: "border-orange-400/40 bg-orange-100/60",
      iconBg: "bg-gradient-to-br from-[#EA580C] to-[#FB923C] text-white shadow-orange-500/30",
      line: "",
    },
    renderCustomIcon: () => (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#C2410C] via-[#EA580C] to-[#FB923C] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
        <Route className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
    ),
  },
];

export function LandingHowItWorks() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Carga perezosa de como-funciona.mp4 tras mostrar la imagen
  useEffect(() => {
    const connection = typeof navigator !== "undefined" ? (navigator as any).connection : null;
    if (connection && (connection.saveData || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g")) {
      return;
    }

    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="como-funciona" className="relative bg-[#F8FAFC] text-slate-900 py-16 md:py-24 px-6 overflow-hidden z-10 font-sans">
      
      {/* Luces de fondo ambientales */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-100/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">

        {/* ========================================================================= */}
        {/* PARTE 1: VIDEO / ANIMACIÓN SUPERIOR CON CARGA HÍBRIDA                     */}
        {/* ========================================================================= */}
        <div className="relative max-w-5xl mx-auto flex items-center justify-center min-h-[280px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-slate-200/90 bg-white">
          
          {/* Capa 1: como-funciona.png inicial para velocidad inmediata */}
          <img
            src="/img/landing/como-funciona.png"
            alt="Cómo Funciona SmartPath"
            className={`w-full h-auto object-contain transition-opacity duration-700 ${
              videoLoaded ? "opacity-0 absolute inset-0 pointer-events-none" : "opacity-100"
            }`}
          />

          {/* Capa 2: como-funciona.mp4 cargado perezosamente */}
          {shouldLoadVideo && (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-auto object-contain transition-opacity duration-700 ${
                videoLoaded ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              <source src="/img/landing/como-funciona.mp4" type="video/mp4" />
            </video>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PARTE 2: ENCABEZADO Y PROCESO EN 4 PASOS                                   */}
        {/* ========================================================================= */}
        <div className="space-y-12 text-center max-w-5xl mx-auto">
          
          {/* Badge & Titular */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
              <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
                04
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                CÓMO FUNCIONA
              </span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight">
              De la vacante a tu ruta{" "}
              <span className="block sm:inline">en 4 pasos</span>
            </h2>
          </div>

          {/* Timeline de 4 Pasos */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 pt-4">
            
            {STEPS.map((step, idx) => (
              <div key={step.number} className="relative flex flex-col items-center text-center group">
                
                {/* Conector horizontal para pantallas de escritorio */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-[44px] left-[58%] w-[84%] h-0.5 bg-slate-200 z-0">
                    <div className="h-full bg-gradient-to-r from-slate-300 to-slate-200"></div>
                  </div>
                )}

                {/* Contenedor concéntrico del Icono */}
                <div className="relative z-10 flex items-center justify-center mb-5">
                  {/* Anillo exterior */}
                  <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 ${step.color.ringOuter} flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shadow-xs`}>
                    {/* Anillo medio */}
                    <div className={`w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 ${step.color.ringMid} flex items-center justify-center`}>
                      {/* Icono central */}
                      {step.renderCustomIcon()}
                    </div>
                  </div>
                </div>

                {/* Badge con número del paso */}
                <div className={`w-6 h-6 rounded-full ${step.color.badge} flex items-center justify-center text-xs font-bold font-display shadow-xs mb-3 z-10`}>
                  {step.number}
                </div>

                {/* Título del paso */}
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {step.title}
                </h3>

                {/* Descripción del paso */}
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed max-w-[220px]">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
