"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Ban, Headphones } from "lucide-react";

export function LandingCTA() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Carga perezosa de cta.mp4
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
    <section className="relative w-full py-24 md:py-36 px-6 overflow-hidden z-10 font-sans bg-[#11052C] flex items-center justify-center">
      
      {/* ========================================================================= */}
      {/* 1. VIDEO DE FONDO LAZY LOADING DE ANCHO COMPLETO                          */}
      {/* ========================================================================= */}
      {shouldLoadVideo && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            className={`w-full h-full object-cover filter brightness-105 contrast-110 transition-opacity duration-1000 ${
              videoLoaded ? "opacity-75" : "opacity-0"
            }`}
          >
            <source src="/img/landing/cta.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CAPAS DE OVERLAY PARA MÁXIMO CONTRASTE Y LEGIBILIDAD DE LETRAS         */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C24]/80 via-[#1A063E]/80 to-[#0B0F2E]/30 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[#0B0C24]/20 pointer-events-none"></div>

      {/* ========================================================================= */}
      {/* 3. CONTENIDO 100% CENTRADO                                                */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8 text-white">
        
        {/* Titular */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
            Vamos a por tu siguiente objetivo
          </h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
            Únete a miles de estudiantes que ya mapearon su futuro.{" "}
            <span className="font-semibold text-white block sm:inline">Comienza gratis hoy.</span>
          </p>
        </div>

        {/* Botón Principal Centrado (Sin campo de email) */}
        <div className="pt-2 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF7A45] to-[#FFA940] hover:from-[#EA580C] hover:to-[#FF7A45] text-white font-display font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Comenzar ahora</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Bullets de Confianza Centrados */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/90 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Sin tarjeta</span>
          </div>
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-white" />
            <span>Cancela cuando quieras</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-white" />
            <span>Soporte 24/7</span>
          </div>
        </div>

      </div>

    </section>
  );
}
