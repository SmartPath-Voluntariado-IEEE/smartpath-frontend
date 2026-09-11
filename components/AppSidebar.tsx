"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabaseClient";
import { useSmartPathTour } from "@/components/tour/SmartPathTourProvider";
import { AppTooltip } from "@/components/ui/tooltip";
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

  const isLanding = pathname === "/" || pathname === "/landing" || pathname === "/onboarding";
  const isAuthed = hydrated && !!profile && !isLanding;

  if (!isAuthed && mounted) {
    return null;
  }
  if (!mounted) {
    return null;
  }

  return (
    <aside
      aria-label="Barra lateral de navegación"
      className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen z-50 bg-white border-r border-slate-200/90 select-none shadow-xs transition-[width] duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Cabecera del Sidebar: Logo y Botón Minimizar */}
      <div
        className={`flex items-center h-16 border-b border-slate-100 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!isCollapsed && (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 overflow-hidden transition-all duration-300"
            title="Ir al Dashboard"
          >
            <img
              src="/img/logo.png"
              alt="SmartPath Logo"
              className="h-8 w-auto object-contain transition-opacity duration-300"
            />
          </Link>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir barra lateral" : "Minimizar barra lateral (solo iconos)"}
          className="p-2 rounded-xl text-slate-400 hover:text-[#6E43FF] hover:bg-[#F3F0FF] transition-colors focus:outline-hidden"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 transition-transform duration-200 hover:scale-105" />
          ) : (
            <PanelLeftClose className="w-5 h-5 transition-transform duration-200 hover:scale-105" />
          )}
        </button>
      </div>

      {/* Contenedor principal: Módulos arriba y General abajo */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-3">
        {/* SECCIÓN MÓDULOS */}
        <nav data-tour="nav-sections" className="space-y-1.5">
          {MODULE_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <AppTooltip
                key={item.href}
                content={
                  isCollapsed ? (
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-100">{item.label}</span>
                      <span className="text-[10px] text-slate-300 font-normal">{item.description}</span>
                    </div>
                  ) : null
                }
                side="right"
                sideOffset={12}
              >
                <Link
                  href={item.href}
                  data-tour={item.tourId}
                  className={`flex items-center rounded-xl transition-all duration-200 ${
                    isCollapsed ? "w-12 h-12 mx-auto justify-center p-0" : "w-full px-3.5 py-2.5"
                  } ${
                    isActive
                      ? "bg-[#F3F0FF] text-[#6E43FF] font-semibold shadow-2xs"
                      : "text-slate-600 hover:text-[#6E43FF] hover:bg-slate-50 font-medium"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isActive ? "text-[#6E43FF] scale-110" : "text-slate-500 group-hover:text-[#6E43FF]"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden text-sm ml-3">
                      {item.label}
                    </span>
                  )}
                </Link>
              </AppTooltip>
            );
          })}
        </nav>

        {/* SECCIÓN GENERAL AL FONDO */}
        <div className="pt-3 border-t border-slate-200/80 space-y-1.5 mt-auto">
          {/* 1. Perfil */}
          <AppTooltip
            content={
              isCollapsed ? (
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-100">Perfil</span>
                  <span className="text-[10px] text-slate-300 font-normal">
                    {profile?.fullName || profile?.email || "Configuración de cuenta"}
                  </span>
                </div>
              ) : null
            }
            side="right"
            sideOffset={12}
          >
            <Link
              href="/perfil"
              className={`flex items-center rounded-xl transition-all duration-200 ${
                isCollapsed ? "w-12 h-12 mx-auto justify-center p-0" : "w-full px-3.5 py-2.5"
              } ${
                pathname.startsWith("/perfil")
                  ? "bg-[#F3F0FF] text-[#6E43FF] font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-[#6E43FF] hover:bg-slate-50 font-medium"
              }`}
            >
              <UserCircle
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  pathname.startsWith("/perfil")
                    ? "text-[#6E43FF] scale-110"
                    : "text-slate-500 group-hover:text-[#6E43FF]"
                }`}
              />
              {!isCollapsed && (
                <div className="whitespace-nowrap overflow-hidden flex flex-col ml-3">
                  <span className="text-sm font-medium leading-tight truncate max-w-[140px]">
                    {profile?.fullName || profile?.email || "Mi Perfil"}
                  </span>
                  <span className="text-[10px] text-slate-400">Ver cuenta</span>
                </div>
              )}
            </Link>
          </AppTooltip>

          {/* 2. Guía Tour */}
          <AppTooltip
            content={
              isCollapsed ? (
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-100">Guía tour</span>
                  <span className="text-[10px] text-slate-300 font-normal">Repasar el recorrido guiado</span>
                </div>
              ) : null
            }
            side="right"
            sideOffset={12}
          >
            <button
              type="button"
              onClick={startTour}
              className={`flex items-center rounded-xl transition-all duration-200 text-left ${
                isCollapsed ? "w-12 h-12 mx-auto justify-center p-0" : "w-full px-3.5 py-2.5"
              } text-slate-600 hover:text-[#6E43FF] hover:bg-[#F3F0FF] font-medium`}
            >
              <Compass className="w-5 h-5 shrink-0 text-slate-500 group-hover:text-[#6E43FF]" />
              {!isCollapsed && (
                <div className="whitespace-nowrap overflow-hidden flex items-center justify-between flex-1 ml-3">
                  <span className="text-sm">Guía tour</span>
                  <span className="text-[10px] font-bold bg-[#F3F0FF] text-[#6E43FF] px-1.5 py-0.5 rounded-md">
                    Interactivo
                  </span>
                </div>
              )}
            </button>
          </AppTooltip>

          {/* 3. Racha (Oculta en modo minimizado) */}
          {!isCollapsed && (
            <div className="flex items-center rounded-xl transition-all duration-200 bg-orange-50/80 border border-orange-200/60 px-3.5 py-2.5">
              <Flame className="w-5 h-5 shrink-0 text-[#FF8A00] animate-pulse" />
              <div className="whitespace-nowrap overflow-hidden flex items-center justify-between flex-1 ml-3">
                <span className="text-xs font-semibold text-orange-950">Racha activa</span>
                <span className="text-xs font-extrabold text-[#FF8A00] bg-white px-2 py-0.5 rounded-full shadow-2xs border border-orange-200/50">
                  10 días 🔥
                </span>
              </div>
            </div>
          )}

          {/* 4. Cerrar sesión */}
          <AppTooltip
            content={
              isCollapsed ? (
                <div className="flex flex-col">
                  <span className="font-semibold text-rose-300">Cerrar sesión</span>
                  <span className="text-[10px] text-slate-300 font-normal">Salir de tu cuenta</span>
                </div>
              ) : null
            }
            side="right"
            sideOffset={12}
          >
            <button
              type="button"
              onClick={handleLogout}
              className={`flex items-center rounded-xl transition-all duration-200 text-left ${
                isCollapsed ? "w-12 h-12 mx-auto justify-center p-0" : "w-full px-3.5 py-2.5"
              } text-red-600 bg-red-50/70 hover:bg-red-100/90 border border-red-100/80 font-medium`}
            >
              <LogOut className="w-5 h-5 shrink-0 text-red-500 transition-transform duration-200 group-hover:-translate-x-0.5" />
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden text-sm font-semibold text-red-600 ml-3">
                  Cerrar sesión
                </span>
              )}
            </button>
          </AppTooltip>
        </div>
      </div>
    </aside>
  );
}
