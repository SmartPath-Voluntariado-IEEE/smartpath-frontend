"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Clock,
  ShieldCheck,
  Flame,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import {
  Python,
  Docker,
  AWS,
  React as ReactIcon,
  TypeScript,
  PostgreSQL,
  NodeJs,
  Kubernetes,
  Git,
} from "developer-icons";

const TECH_SLOTS = [
  {
    id: "slot-top-left",
    positionClass: "-top-6 -left-3 sm:-top-8 sm:-left-7 lg:-top-10 lg:-left-12",
    animationClass: "animate-bounce duration-[4000ms]",
    icons: [
      { name: "Python", component: Python, color: "#38BDF8", glow: "shadow-sky-500/40 border-sky-500/40" },
      { name: "TypeScript", component: TypeScript, color: "#60A5FA", glow: "shadow-blue-500/40 border-blue-500/40" },
      { name: "React", component: ReactIcon, color: "#38BDF8", glow: "shadow-cyan-500/40 border-cyan-500/40" },
    ],
  },
  {
    id: "slot-mid-left",
    positionClass: "top-[42%] -left-4 sm:-left-8 lg:-left-14",
    animationClass: "animate-pulse duration-[3500ms]",
    icons: [
      { name: "Docker", component: Docker, color: "#38BDF8", glow: "shadow-blue-500/40 border-blue-500/40" },
      { name: "Node.js", component: NodeJs, color: "#4ADE80", glow: "shadow-emerald-500/40 border-emerald-500/40" },
      { name: "PostgreSQL", component: PostgreSQL, color: "#818CF8", glow: "shadow-indigo-500/40 border-indigo-500/40" },
    ],
  },
  {
    id: "slot-bot-left",
    positionClass: "-bottom-5 left-4 sm:-bottom-7 sm:-left-4 lg:-bottom-9 lg:-left-8",
    animationClass: "animate-bounce duration-[4500ms]",
    icons: [
      { name: "AWS", component: AWS, color: "#FB923C", glow: "shadow-amber-500/40 border-amber-500/40" },
      { name: "Kubernetes", component: Kubernetes, color: "#60A5FA", glow: "shadow-blue-500/40 border-blue-500/40" },
      { name: "Git", component: Git, color: "#F87171", glow: "shadow-rose-500/40 border-rose-500/40" },
    ],
  },
];

export function LandingHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCycleIndex, setActiveCycleIndex] = useState(0);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Ciclo para alternar iconos dinámicos flotantes en el camino de luz
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCycleIndex((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Carga diferida / perezosa del video de fondo tras renderizar la imagen inicial
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
    <section className="relative bg-[#060718] text-white overflow-hidden selection:bg-purple-500 selection:text-white font-sans">
      
      {/* ========================================================================= */}
      {/* 1. FONDO CÓSMICO CON GRADIENTE ANIMADO & PATHWAY NEÓN                      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Orbes de luz ambiental */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-indigo-600/15 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[130px]"></div>
        
        {/* Capa 1: Imagen estática de inicio rápido (hero.png) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/img/landing/hero.png"
            alt="SmartPath Neon Background"
            className={`w-full h-full object-cover object-center md:object-right filter brightness-105 transition-opacity duration-1000 ${
              videoLoaded ? "opacity-0" : "opacity-90"
            }`}
          />
        </div>

        {/* Capa 2: Video dinámico cargado de forma perezosa (hero-video.mp4) */}
        {shouldLoadVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover object-center md:object-right filter brightness-105 transition-opacity duration-1000 ${
                videoLoaded ? "opacity-90" : "opacity-0"
              }`}
            >
              <source src="/img/landing/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        {/* Capa de Overlay para máxima legibilidad de texto y contraste */}
        <div className="absolute inset-0 bg-[#060718]/45 pointer-events-none"></div>
        <div className="absolute inset-y-0 left-0 w-full md:w-[70%] lg:w-[60%] bg-gradient-to-r from-[#060718] via-[#060718]/85 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060718]/90 to-transparent pointer-events-none"></div>

        {/* Gradiente sutil inferior para difuminar hacia las siguientes secciones */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060718] to-transparent pointer-events-none"></div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVBAR SUPERIOR FLOTANTE                                               */}
      {/* ========================================================================= */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/img/LOGOUNI.png" alt="SmartPath Logo" className="h-8 w-auto object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
            SmartPath
          </span>
        </Link>

        {/* Enlaces de Navegación (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#por-que-smartpath" className="hover:text-white transition-colors">Beneficios</a>
          <a href="#impacto-real" className="hover:text-white transition-colors">Impacto</a>
          <a href="#casos-de-exito" className="hover:text-white transition-colors">Casos de éxito</a>
        </nav>

        {/* Acciones de Autenticación */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#6E43FF] to-[#8B5CF6] hover:from-[#5B2FE0] hover:to-[#7C3AED] rounded-xl shadow-lg shadow-purple-900/30 transition-all hover:scale-105 active:scale-95"
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Botón Hamburger (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="relative z-40 md:hidden bg-[#0B0C24]/95 backdrop-blur-xl border-b border-purple-500/20 px-6 py-6 space-y-4">
          <a href="#como-funciona" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200">Cómo funciona</a>
          <a href="#por-que-smartpath" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200">Beneficios</a>
          <a href="#impacto-real" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200">Impacto</a>
          <a href="#casos-de-exito" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200">Casos de éxito</a>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <Link href="/login" className="text-center py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#6E43FF] to-[#8B5CF6] rounded-xl">
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HERO SECTION PRINCIPAL                                                 */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-20 md:pt-16 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* COLUMNA IZQUIERDA: Narrativa, Titular y CTAs */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left">
            
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12]">
              Descubre las habilidades que te llevan{" "}
              <span className="bg-gradient-to-r from-[#FF7A45] via-[#FF6B4A] to-[#FFA940] bg-clip-text text-transparent drop-shadow-sm">
                más lejos
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300/90 max-w-xl leading-relaxed font-normal">
              Analizamos miles de vacantes peruanas para crear tu ruta de aprendizaje personalizada.
            </p>

            {/* Botón Principal CTA */}
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6E43FF] via-[#8B5CF6] to-[#FF7A45] text-white font-display font-bold text-base md:text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <span>Comienza gratis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Bullets de Confianza */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-white shrink-0" />
                <span>Sin tarjeta</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white shrink-0" />
                <span>2 min setup</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>Cancela cuando quieras</span>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: Vista Isométrica del Dashboard & Iconos Dinámicos */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0">

            {/* Contenedor relativo de la tarjeta y sus badges flotantes */}
            <div
              className="w-full max-w-lg relative transition-transform duration-700 ease-out lg:hover:rotate-0"
              style={{
                perspective: "1200px",
              }}
            >
              {/* Iconos tecnológicos flotantes anclados a la periferia */}
              {TECH_SLOTS.map((slot) => {
                const current = slot.icons[activeCycleIndex % slot.icons.length];
                const IconComponent = current.component;
                return (
                  <div
                    key={slot.id}
                    className={`absolute ${slot.positionClass} z-30 transition-all duration-700 transform hover:scale-110 pointer-events-auto select-none`}
                  >
                    <div
                      className={`flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-[#0B0C26]/90 backdrop-blur-xl border ${current.glow} shadow-xl transition-all duration-500`}
                    >
                      <IconComponent size={24} />
                    </div>
                  </div>
                );
              })}

              <div
                className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/80 transition-all duration-500"
                style={{
                  transform: "perspective(1200px) rotateY(-8deg) rotateX(4deg)",
                  transformStyle: "preserve-3d",
                  boxShadow: "0 25px 50px -12px rgba(110, 67, 255, 0.25), 0 0 40px rgba(255, 122, 69, 0.15)",
                }}
              >
                {/* Header del Perfil + Radial Gauge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                        alt="Avatar Carlos"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#6E43FF]/30 shadow-xs"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-slate-900 text-base flex items-center gap-1.5">
                        ¡Hola, Carlos! 👋
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Backend Developer Track
                      </p>
                    </div>
                  </div>

                  {/* Circular Gauge 65% */}
                  <div className="relative flex items-center justify-center shrink-0 w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#6E43FF]"
                        strokeDasharray="65, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-display font-bold text-[#6E43FF] leading-none">65%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Progreso</span>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso sutil bajo avatar */}
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6E43FF] rounded-full" style={{ width: "65%" }}></div>
                </div>

                {/* Grid con Roadmap Step Progression & Brechas Prioritarias */}
                <div className="mt-6 grid grid-cols-12 gap-4">
                  
                  {/* Roadmap Timeline (8 cols) */}
                  <div className="col-span-8 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Tu Roadmap</span>
                    
                    <div className="pt-2 relative flex items-center justify-between">
                      {/* Línea conectora */}
                      <div className="absolute left-2 right-2 top-4 h-0.5 bg-slate-200 -z-0"></div>
                      
                      {/* Nodo 1: Git */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 mt-1">Git</span>
                        <span className="text-[8px] text-emerald-600 font-semibold">Completado</span>
                      </div>

                      {/* Nodo 2: SQL */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 mt-1">SQL</span>
                        <span className="text-[8px] text-emerald-600 font-semibold">Completado</span>
                      </div>

                      {/* Nodo 3: Java */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-purple-100 shadow-xs">
                          ●
                        </div>
                        <span className="text-[10px] font-bold text-[#6E43FF] mt-1">Java</span>
                        <span className="text-[8px] text-[#6E43FF] font-semibold">In progress</span>
                      </div>

                      {/* Nodo 4: Docker */}
                      <div className="flex flex-col items-center z-10 opacity-60">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                          ○
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 mt-1">Docker</span>
                        <span className="text-[8px] text-slate-400">Aspirante</span>
                      </div>

                      {/* Nodo 5: AWS */}
                      <div className="flex flex-col items-center z-10 opacity-40">
                        <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                          ○
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 mt-1">AWS</span>
                        <span className="text-[8px] text-slate-400">Roadmap</span>
                      </div>
                    </div>
                  </div>

                  {/* Brechas Prioritarias (4 cols) */}
                  <div className="col-span-4 pl-3 border-l border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Brechas</span>
                    
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                        <Flame className="w-3 h-3 shrink-0" /> Docker
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                        <Flame className="w-3 h-3 shrink-0" /> AWS
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer del Mockup: Proyección Salarial */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Proyección salarial</span>
                    <div className="flex items-center gap-2 mt-0.5 font-bold text-slate-900">
                      <span>S/ 1,800</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[#6E43FF] text-sm">S/ 4,500</span>
                    </div>
                  </div>

                  <div className="flex items-center -space-x-2">
                    <img className="w-6 h-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" alt="Recruiter 1" />
                    <img className="w-6 h-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" alt="Recruiter 2" />
                    <div className="w-6 h-6 rounded-full bg-purple-100 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-[#6E43FF]">
                      +14
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. EFECTO DE TRANSICIÓN CÓSMICO HACIA SECCIÓN CLARA                       */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden leading-none z-20">
        {/* Línea de energía neón que divide los mundos */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent shadow-[0_0_15px_#8B5CF6]"></div>

        {/* Curva SVG fluida con degradado hacia el fondo claro */}
        <svg
          className="relative block w-full h-16 sm:h-24 md:h-32 text-[#F8FAFC]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

    </section>
  );
}
