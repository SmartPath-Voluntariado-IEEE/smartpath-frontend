"use client";

import {
  Map,
  BarChart3,
  LayoutDashboard,
  Route,
  Sparkles,
  BookOpen,
  TrendingUp,
  FileText,
  Settings,
  Flame,
  CheckCircle2,
  ChevronRight,
  Lock,
} from "lucide-react";

export function LandingSolution() {
  return (
    <section id="plataforma" className="relative bg-white text-slate-900 py-16 md:py-24 px-6 overflow-hidden z-10 font-sans border-t border-slate-100">
      
      {/* Orbes de luz ambientales */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* ========================================================================= */}
          {/* COLUMNA IZQUIERDA: Narrativa, Titular con gradiente y Bento pills          */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Badge 05 LA PLATAFORMA */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
              <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
                05
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                LA PLATAFORMA
              </span>
            </div>

            {/* Titular */}
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-[1.14] tracking-tight">
              Visualiza tu camino{" "}
              <span className="block mt-1">
                <span className="text-[#6E43FF]">al empleo </span>
                <span className="bg-gradient-to-r from-[#FF7A45] to-[#FFA940] bg-clip-text text-transparent">
                  soñado
                </span>
              </span>
            </h2>

            {/* Párrafo descriptivo */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              Tu dashboard muestra progreso, habilidades, cursos recomendados y proyección salarial.
            </p>

            {/* 2 Bento Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
              
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
                <div className="p-2.5 rounded-xl bg-purple-100 text-[#6E43FF] shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    Roadmap visual
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    tipo metro
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all">
                <div className="p-2.5 rounded-xl bg-purple-100 text-[#6E43FF] shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    Progreso medible
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    semana a semana
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* COLUMNA DERECHA: MOCKUP INTERACTIVO COMPLETO DE LA PLATAFORMA             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 relative">
            
            {/* Contenedor del Mockup con Sombra y Borde */}
            <div className="w-full rounded-3xl bg-[#0B0C24] text-white shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
              
              {/* SIDEBAR OSCURO (Mockup) */}
              <div className="w-full md:w-52 bg-[#0B0C24] p-5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                  
                  {/* Logo Mockup */}
                  <div className="flex items-center gap-2">
                    <img src="/img/LOGOUNI.png" alt="Smartpath" className="h-6 w-auto object-contain" />
                    <span className="font-display font-bold text-base tracking-tight text-white">Smartpath</span>
                  </div>

                  {/* Links de navegación del Dashboard */}
                  <div className="space-y-1 text-xs font-medium">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#6E43FF] text-white font-bold shadow-md shadow-purple-900/40">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Route className="w-4 h-4" />
                      <span>Mi roadmap</span>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Sparkles className="w-4 h-4" />
                      <span>Habilidades</span>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                      <BookOpen className="w-4 h-4" />
                      <span>Cursos</span>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                      <TrendingUp className="w-4 h-4" />
                      <span>Progreso</span>
                    </div>

                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Reportes</span>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-white/10 hidden md:block">
                  <div className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                    <span>Ajustes</span>
                  </div>
                </div>

              </div>

              {/* CONTENIDO PRINCIPAL DEL DASHBOARD (Mockup) */}
              <div className="flex-1 bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 space-y-5 overflow-hidden">
                
                {/* 1. Header Carlos M. + Brechas Prioritarias */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Perfil & Progreso general (8 cols) */}
                  <div className="md:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Carlos M."
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-100"
                      />
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm">Carlos M.</h4>
                        <span className="text-[11px] text-slate-500 font-medium">Backend Developer Track</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#6E43FF] font-display">65%</span>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Progreso general</span>
                    </div>
                  </div>

                  {/* Brechas prioritarias (5 cols) */}
                  <div className="md:col-span-5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Brechas prioritarias
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-orange-500 shrink-0" /> Docker <span className="text-[8px] font-medium text-orange-400">Alta</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-orange-500 shrink-0" /> AWS <span className="text-[8px] font-medium text-orange-400">Alta</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* 2. Grid Central: Roadmap Tipo Metro + Cursos Recomendados */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Roadmap tipo metro (7 cols) */}
                  <div className="md:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tu roadmap</span>
                    
                    <div className="pt-2 relative flex items-center justify-between">
                      {/* Línea conectora */}
                      <div className="absolute left-3 right-3 top-3.5 h-0.5 bg-slate-200 -z-0"></div>
                      
                      {/* Node 1: Git */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 mt-1">Git</span>
                        <span className="text-[8px] text-emerald-600 font-semibold">Completado</span>
                      </div>

                      {/* Node 2: SQL */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 mt-1">SQL</span>
                        <span className="text-[8px] text-emerald-600 font-semibold">Completado</span>
                      </div>

                      {/* Node 3: Java */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-6 h-6 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-purple-100 shadow-xs">
                          ●
                        </div>
                        <span className="text-[10px] font-bold text-[#6E43FF] mt-1">Java</span>
                        <span className="text-[8px] text-amber-500 font-semibold">En progreso</span>
                      </div>

                      {/* Node 4: Docker */}
                      <div className="flex flex-col items-center z-10 opacity-70">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 mt-1">Docker</span>
                        <span className="text-[8px] text-slate-400">Pendiente</span>
                      </div>

                      {/* Node 5: AWS */}
                      <div className="flex flex-col items-center z-10 opacity-50">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 mt-1">AWS</span>
                        <span className="text-[8px] text-slate-400">Pendiente</span>
                      </div>
                    </div>
                  </div>

                  {/* Cursos recomendados (5 cols) */}
                  <div className="md:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                      Cursos recomendados
                    </span>
                    
                    <div className="space-y-1.5">
                      {/* Curso 1 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0056D2] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                            udemy
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-900 block leading-tight">Docker de cero a experto</span>
                            <span className="text-[9px] text-slate-500">Udemy · 12h · S/ 49.90</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      {/* Curso 2 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0056D2] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                            c
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-900 block leading-tight">AWS Cloud Practitioner</span>
                            <span className="text-[9px] text-slate-500">Coursera · 20h · Gratis</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    <a href="#cursos" className="text-[10px] font-bold text-[#6E43FF] hover:underline block text-center pt-0.5">
                      Ver todos los cursos →
                    </a>
                  </div>

                </div>

                {/* 3. Fila Inferior: Gráfico Semanal + Actividades + Proyección Salarial */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Progreso Semanal (Bar chart) */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block">
                      Progreso semanal
                    </span>
                    <div className="h-16 flex items-end justify-between gap-1.5 px-1">
                      {[
                        { day: "Dom", height: "h-3" },
                        { day: "Lun", height: "h-11" },
                        { day: "Mar", height: "h-7" },
                        { day: "Mié", height: "h-12" },
                        { day: "Jue", height: "h-10" },
                        { day: "Vie", height: "h-14" },
                        { day: "Sáb", height: "h-6" },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                          <div className={`w-full ${item.height} bg-[#6E43FF] rounded-t-xs hover:bg-[#582CD6] transition-colors`}></div>
                          <span className="text-[8px] text-slate-400 font-semibold">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Últimas actividades */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block">
                      Últimas actividades
                    </span>
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-800 block leading-tight">Curso Java Básico</span>
                          <span className="text-[8px] text-emerald-600 font-medium">Completado</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-800 block leading-tight">Práctica API REST</span>
                          <span className="text-[8px] text-emerald-600 font-medium">Completado</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proyección salarial (Line chart) */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Proyección salarial
                      </span>
                      <div className="mt-0.5 flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-slate-900 font-display">S/ 4,500</span>
                        <span className="text-[9px] text-slate-500 font-medium">Promedio mensual</span>
                      </div>
                    </div>
                    
                    {/* Mini gráfico SVG ascendente */}
                    <div className="pt-2">
                      <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30">
                        <defs>
                          <linearGradient id="salaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6E43FF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6E43FF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,25 Q20,24 40,18 T70,12 T100,4 L100,30 L0,30 Z"
                          fill="url(#salaryGrad)"
                        />
                        <path
                          d="M0,25 Q20,24 40,18 T70,12 T100,4"
                          fill="none"
                          stroke="#6E43FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="100" cy="4" r="3" fill="#6E43FF" />
                      </svg>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
