"use client";

import React, { useEffect, useMemo } from "react";
import { TourProvider, useTour, StepType } from "@reactour/tour";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Compass, Sparkles, MapPin, BookOpen, Briefcase, ArrowRight, Check } from "lucide-react";

const TOUR_STORAGE_KEY = "smartpath.tour_completed";

export function SmartPathTourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const steps: StepType[] = useMemo(() => [
    {
      selector: '[data-tour="nav-sections"]',
      content: () => (
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6E43FF]">
            <Compass className="w-4 h-4" />
            <span>Paso 1 de 5 · Navegación Principal</span>
          </div>
          <h4 className="font-poppins font-bold text-slate-900 text-base">
            Las 4 Áreas Clave de SmartPath
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aquí puedes alternar rápidamente entre tu <strong>Dashboard</strong>, tu <strong>Roadmap</strong> por niveles, el catálogo de <strong>Cursos</strong> y las ofertas de <strong>Bolsa Laboral</strong>.
          </p>
        </div>
      ),
    },
    {
      selector: '[data-tour="dashboard-hero"]',
      content: () => (
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6E43FF]">
            <MapPin className="w-4 h-4" />
            <span>Paso 2 de 5 · Tu Meta y Progreso</span>
          </div>
          <h4 className="font-poppins font-bold text-slate-900 text-base">
            Centro de Progreso y Racha
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Basado en tu perfil y horas semanales, este panel mide el porcentaje total de tu ruta hacia tu rol objetivo y mantiene viva tu racha de aprendizaje.
          </p>
        </div>
      ),
    },
    {
      selector: '[data-tour="dashboard-next-action"]',
      content: () => (
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            <Sparkles className="w-4 h-4 text-[#FF8A00]" />
            <span>Paso 3 de 5 · Siguiente Acción Inmediata</span>
          </div>
          <h4 className="font-poppins font-bold text-slate-900 text-base">
            ¿Qué hago hoy?
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nunca te quedarás con la duda de por dónde empezar. Esta tarjeta te sugiere la habilidad de mayor impacto para tu perfil y te conecta directo con el curso recomendado.
          </p>
        </div>
      ),
    },
    {
      selector: '[data-tour="dashboard-courses"]',
      content: () => (
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3D5AFE]">
            <BookOpen className="w-4 h-4" />
            <span>Paso 4 de 5 · Mis Cursos Activos</span>
          </div>
          <h4 className="font-poppins font-bold text-slate-900 text-base">
            Continúa tus Cursos Donde los Dejaste
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cada curso seleccionado para tu roadmap aparecerá aquí con su porcentaje de avance para que retomes tus módulos con un solo clic.
          </p>
        </div>
      ),
    },
    {
      selector: '[data-tour="dashboard-jobs"]',
      content: () => (
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Briefcase className="w-4 h-4" />
            <span>Paso 5 de 5 · Mercado Laboral & Match</span>
          </div>
          <h4 className="font-poppins font-bold text-slate-900 text-base">
            Oportunidades y Cierre de Brechas
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Analizamos vacantes reales de empresas peruanas. El medidor te dice qué porcentaje cumples y exactamente qué cursos cerrar para alcanzar el 100% de match.
          </p>
        </div>
      ),
    },
  ], []);

  const customStyles = {
    popover: (base: React.CSSProperties) => ({
      ...base,
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 20px 40px -10px rgba(13, 17, 51, 0.18), 0 0 0 1px rgba(229, 231, 235, 0.9)",
      maxWidth: "380px",
      color: "#0D1133",
      fontFamily: "var(--font-poppins), sans-serif",
    }),
    maskArea: (base: React.CSSProperties) => ({
      ...base,
      rx: 16,
    }),
    badge: (base: React.CSSProperties) => ({
      ...base,
      backgroundColor: "#6E43FF",
      color: "#FFFFFF",
      fontWeight: 700,
      fontSize: "11px",
    }),
    dot: (base: React.CSSProperties, state?: { current?: boolean }) => ({
      ...base,
      backgroundColor: state?.current ? "#6E43FF" : "#E5E7EB",
      width: state?.current ? "20px" : "8px",
      height: "8px",
      borderRadius: "999px",
      transition: "all 0.25s ease",
    }),
    close: (base: React.CSSProperties) => ({
      ...base,
      color: "#6B7280",
      top: 12,
      right: 12,
      width: 24,
      height: 24,
    }),
  };

  return (
    <TourProvider
      steps={steps}
      styles={customStyles}
      padding={10}
      showDots={true}
      showNavigation={true}
      showBadge={true}
      showCloseButton={true}
      scrollSmooth={true}
      beforeClose={() => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(TOUR_STORAGE_KEY, "true");
        }
      }}
      prevButton={({ currentStep, setCurrentStep }) =>
        currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Anterior
          </button>
        ) : null
      }
      nextButton={({ currentStep, stepsLength, setCurrentStep, setIsOpen }) => {
        const isLast = currentStep === (stepsLength || 5) - 1;
        return (
          <button
            onClick={() => {
              if (isLast) {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem(TOUR_STORAGE_KEY, "true");
                }
                setIsOpen(false);
              } else {
                setCurrentStep((s) => s + 1);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6E43FF] hover:bg-[#5B2FE0] text-white text-xs font-bold shadow-xs transition"
          >
            {isLast ? (
              <>
                <span>¡Empezar!</span> <Check className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Siguiente</span> <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        );
      }}
    >
      <TourController />
      {children}
    </TourProvider>
  );
}

/**
 * Controlador interno para disparar automáticamente el tour si:
 * 1. Viene de onboarding con `?tour=true`.
 * 2. Es un usuario nuevo en `/dashboard` que no tiene `smartpath.tour_completed` en localStorage.
 */
function TourController() {
  const { setIsOpen, isOpen } = useTour();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || isOpen) return;

    const tourParam = searchParams.get("tour");
    const isCompleted = window.localStorage.getItem(TOUR_STORAGE_KEY) === "true";

    // Si viene explícitamente con ?tour=true o está en dashboard y nunca lo ha completado
    if (tourParam === "true" || (pathname === "/dashboard" && !isCompleted)) {
      // Breve retardo para asegurar que los elementos del DOM estén montados
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, setIsOpen, isOpen]);

  return null;
}

/**
 * Hook para abrir el tour desde cualquier botón de la UI
 */
export function useSmartPathTour() {
  const { setIsOpen, setCurrentStep } = useTour();

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return { startTour };
}
