"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabaseClient";
import { useSmartPathTour } from "@/components/tour/SmartPathTourProvider";
import {
  LayoutDashboard,
  GitMerge,
  BookOpen,
  Briefcase,
  UserCircle,
  Compass,
  Flame,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const MODULE_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    tourId: "nav-dashboard",
    description: "Resumen y progreso general",
  },
  {
    href: "/roadmap",
    label: "Roadmap",
    icon: GitMerge,
    tourId: "nav-roadmap",
    description: "Ruta de habilidades y niveles",
  },
  {
    href: "/cursos",
    label: "Cursos",
    icon: BookOpen,
    tourId: "nav-cursos",
    description: "Cursos recomendados para ti",
  },
  {
    href: "/bolsa-laboral",
    label: "Bolsa laboral",
    icon: Briefcase,
    tourId: "nav-bolsa",
    description: "Vacantes que calzan con tu perfil",
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, hydrated, clear } = useProfile();
  const { startTour } = useSmartPathTour();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("smartpath.sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("smartpath.sidebar_collapsed", String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    localStorage.removeItem("access_token");
    clear();
    router.push("/");
  };

  // Do not render sidebar on landing or onboarding
  const isLanding = pathname === "/" || pathname === "/landing" || pathname === "/onboarding";
  const isAuthed = hydrated && !!profile && !isLanding;

  if (!isAuthed && mounted) {
    return null;
  }
  if (!mounted) {
    // Avoid layout flash before hydration
    return null;
  }

  return (
    <aside
      aria-label="Barra lateral de navegación"
      className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen z-30 bg-white border-r border-slate-200/90 select-none shadow-xs transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 overflow-hidden transition-all duration-300"
          title="Ir al Dashboard"
        >
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6E43FF] to-[#9B7BFF] flex items-center justify-center text-white font-bold text-lg shadow-sm mx-auto">
              S
            </div>
          ) : (
            <img
              src="/img/logo.png"
              alt="SmartPath Logo"
              className="h-9 w-auto object-contain transition-opacity duration-300"
            />
          )}
        </Link>

        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir barra lateral" : "Minimizar barra lateral (solo iconos)"}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#6E43FF]/20"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 transition-transform duration-200 hover:scale-105" />
          ) : (
            <PanelLeftClose className="w-5 h-5 transition-transform duration-200 hover:scale-105" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6">
        <div>
          <div className="px-2 mb-2 flex items-center justify-between min-h-[18px]">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              Módulos
            </span>
            {isCollapsed && (
              <div className="w-6 h-0.5 bg-slate-200 mx-auto rounded-full" />
            )}
          </div>

          <nav data-tour="nav-sections" className="space-y-1">
            {MODULE_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    data-tour={item.tourId}
                    className={`flex items-center rounded-xl transition-all duration-200 ${
                      isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5"
                    } ${
                      isActive
                        ? "bg-[#F3F0FF] text-[#6E43FF] font-semibold shadow-2xs"
                        : "text-slate-600 hover:text-[#6E43FF] hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isActive ? "text-[#6E43FF] scale-105" : "text-slate-500 group-hover:text-[#6E43FF]"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-300 text-sm ${
                        isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>

                  {/* Floating Tooltip when Collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-[10px] text-slate-300 font-normal">{item.description}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200/80 mx-1" />

        <div>
          <div className="px-2 mb-2 flex items-center justify-between min-h-[18px]">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              General
            </span>
            {isCollapsed && (
              <div className="w-6 h-0.5 bg-slate-200 mx-auto rounded-full" />
            )}
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Link
                href="/perfil"
                className={`flex items-center rounded-xl transition-all duration-200 ${
                  isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5"
                } ${
                  pathname.startsWith("/perfil")
                    ? "bg-[#F3F0FF] text-[#6E43FF] font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-[#6E43FF] hover:bg-slate-50 font-medium"
                }`}
              >
                <UserCircle
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    pathname.startsWith("/perfil") ? "text-[#6E43FF] scale-105" : "text-slate-500 group-hover:text-[#6E43FF]"
                  }`}
                />
                <div
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 flex flex-col ${
                    isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                  }`}
                >
                  <span className="text-sm font-medium leading-tight truncate max-w-[140px]">
                    {profile?.fullName || profile?.email || "Mi Perfil"}
                  </span>
                  <span className="text-[10px] text-slate-400">Ver cuenta</span>
                </div>
              </Link>

              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                  <span className="font-semibold">Perfil</span>
                  <span className="text-[10px] text-slate-300 font-normal">
                    {profile?.fullName || profile?.email || "Configuración de cuenta"}
                  </span>
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={startTour}
                className={`w-full flex items-center rounded-xl transition-all duration-200 text-left ${
                  isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5"
                } text-slate-600 hover:text-[#6E43FF] hover:bg-slate-50 font-medium`}
              >
                <Compass className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-[#6E43FF] transition-transform duration-200 group-hover:rotate-45" />
                <div
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 flex items-center justify-between flex-1 ${
                    isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                  }`}
                >
                  <span className="text-sm">Guía tour</span>
                  <span className="text-[10px] font-bold bg-[#F3F0FF] text-[#6E43FF] px-1.5 py-0.5 rounded-md">
                    Interactivo
                  </span>
                </div>
              </button>

              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                  <span className="font-semibold">Guía tour</span>
                  <span className="text-[10px] text-slate-300 font-normal">Repasar el recorrido guiado</span>
                </div>
              )}
            </div>

            <div className="relative group">
              <div
                className={`flex items-center rounded-xl transition-all duration-200 bg-orange-50/70 border border-orange-200/60 ${
                  isCollapsed ? "justify-center p-2.5" : "px-3.5 py-2.5"
                }`}
              >
                <Flame className="w-5 h-5 shrink-0 text-[#FF8A00] animate-pulse" />
                <div
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 flex items-center justify-between flex-1 ${
                    isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                  }`}
                >
                  <span className="text-xs font-semibold text-orange-950">Racha activa</span>
                  <span className="text-xs font-extrabold text-[#FF8A00] bg-white px-2 py-0.5 rounded-full shadow-2xs border border-orange-200/50">
                    10 días 🔥
                  </span>
                </div>
              </div>

              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                  <span className="font-semibold text-[#FF8A00]">Racha: 10 días 🔥</span>
                  <span className="text-[10px] text-slate-300 font-normal">¡Mantén el hábito diario!</span>
                </div>
              )}
            </div>

            <div className="relative group pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className={`w-full flex items-center rounded-xl transition-all duration-200 text-left ${
                  isCollapsed ? "justify-center p-3" : "px-3.5 py-2.5"
                } text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-medium`}
              >
                <LogOut className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 text-sm ${
                    isCollapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
                  }`}
                >
                  Cerrar sesión
                </span>
              </button>

              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                  <span className="font-semibold text-rose-300">Cerrar sesión</span>
                  <span className="text-[10px] text-slate-300 font-normal">Salir de tu cuenta</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
