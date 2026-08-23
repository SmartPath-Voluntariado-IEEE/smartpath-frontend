"use client";

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export function LandingProblem() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Carga diferida / perezosa del video cards-problem.mp4 tras mostrar problem.svg
  useEffect(() => {
    const connection = typeof navigator !== "undefined" ? (navigator as any).connection : null;
    if (connection && (connection.saveData || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g")) {
      return;
    }

    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="problema" className="relative bg-[#F8FAFC] text-slate-900 py-16 md:py-24 px-6 overflow-hidden z-10 font-sans">
      
      {/* Decoraciones de fondo sutiles */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* COLUMNA IZQUIERDA: Narrativa del problema, advertencias y métricas */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Badge 02 EL PROBLEMA */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
              <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
                02
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                EL PROBLEMA
              </span>
            </div>

            {/* Titular */}
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-[1.15] tracking-tight">
              47,000 cursos disponibles...{" "}
              <span className="text-[#6E43FF] block sm:inline">
                ¿por cuál empezar?
              </span>
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Internet está lleno de cursos, pero nadie te dice cuáles realmente necesitan las empresas peruanas.
            </p>

            {/* Lista de Puntos de Dolor con Alerta */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <span className="inline-flex p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Pasas horas investigando en YouTube y foros
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Inviertes dinero en cursos que no te consiguen empleo
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Aprendes tecnologías que nadie pide en Perú
                </span>
              </div>

              <div className="flex items-start gap-3">
                <span className="inline-flex p-1 rounded-md bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  Te sientes perdido entre tanta información
                </span>
              </div>
            </div>

            {/* Bento Grid de 3 Métricas de Impacto */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-center flex flex-col justify-center">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                  12h
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-tight">
                  promedio investigando
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-center flex flex-col justify-center">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#6E43FF]">
                  67%
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-tight">
                  aprende skills no demandadas
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-center flex flex-col justify-center">
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#6E43FF]">
                  S/. 1,200
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-tight">
                  gastados en cursos incorrectos
                </div>
              </div>
            </div>

            {/* Tarjeta de Cita de Reflexión */}
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 sm:p-5 text-center shadow-xs">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 italic">
                &ldquo;El problema no es la falta de información. Es el exceso sin dirección.&rdquo;
              </p>
            </div>

          </div>

          {/* COLUMNA DERECHA: Imagen SVG inicial + Video diferido de tarjetas */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px]">
            
            {/* Decoraciones de Signos de Interrogación Flotantes */}
            <div className="absolute -top-4 -left-4 text-3xl font-extrabold text-purple-900/30 select-none animate-pulse">
              ?
            </div>
            <div className="absolute top-1/3 -left-6 text-4xl font-extrabold text-indigo-900/30 select-none">
              ?
            </div>
            <div className="absolute -top-6 right-8 text-4xl font-extrabold text-purple-900/30 select-none">
              ?
            </div>
            <div className="absolute bottom-6 right-2 text-4xl font-extrabold text-indigo-900/30 select-none animate-bounce duration-[3000ms]">
              ?
            </div>
            <div className="absolute -bottom-8 left-12 text-3xl font-extrabold text-purple-900/30 select-none">
              ?
            </div>

            {/* Contenedor relativo de imagen SVG + Video */}
            <div className="relative w-full max-w-lg flex items-center justify-center">
              
              {/* Capa 1: problem.svg inicial ultrarrápido */}
              <img
                src="/img/landing/problem.svg"
                alt="El Problema: Cursos caóticos"
                className={`w-full max-w-lg h-auto object-contain transition-opacity duration-700 ${
                  videoLoaded ? "opacity-0 absolute inset-0 pointer-events-none" : "opacity-100"
                }`}
              />

              {/* Capa 2: cards-problem.mp4 en carga perezosa */}
              {shouldLoadVideo && (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onLoadedData={() => setVideoLoaded(true)}
                  className={`w-full max-w-lg h-auto object-contain transition-opacity duration-700 ${
                    videoLoaded ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <source src="/img/landing/cards-problem.mp4" type="video/mp4" />
                </video>
              )}
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
