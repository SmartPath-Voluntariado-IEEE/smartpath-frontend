"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;
export const TooltipPositioner = TooltipPrimitive.Positioner;

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup> {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  showArrow?: boolean;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ className, side = "top", sideOffset = 8, align = "center", showArrow = true, children, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="z-[99999]"
      >
        <TooltipPrimitive.Popup
          ref={ref}
          className={cn(
            "z-[99999] max-w-xs rounded-xl bg-slate-900/95 px-3 py-2 text-xs text-white shadow-2xl backdrop-blur-md border border-slate-700/60 leading-relaxed font-normal normal-case pointer-events-none transition-all duration-200 animate-in fade-in-0 zoom-in-95",
            className
          )}
          {...props}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow className="fill-slate-900/95 drop-shadow-sm data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px]">
              <svg width="10" height="5" viewBox="0 0 10 5" className="block">
                <polygon points="0,0 5,5 10,0" className="fill-slate-900" />
              </svg>
            </TooltipPrimitive.Arrow>
          )}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";

/**
 * Componente unificado de Tooltip envolvente que renderiza mediante Portal
 * evitando cualquier recorte por overflow-hidden en contenedores padre
 */
export function AppTooltip({
  content,
  children,
  side = "top",
  sideOffset = 8,
  align = "center",
  delay = 150,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  delay?: number;
  className?: string;
}) {
  if (!content) return <>{children}</>;

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger
        delay={delay}
        render={(props) => {
          if (React.isValidElement(children)) {
            return React.cloneElement(children as React.ReactElement<any>, {
              ...props,
              className: cn((children.props as any)?.className, (props as any)?.className),
            });
          }
          return (
            <span {...props} className="inline-flex">
              {children}
            </span>
          );
        }}
      />
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={className}
      >
        {content}
      </TooltipContent>
    </TooltipPrimitive.Root>
  );
}

/**
 * Tooltip estándar de ayuda con ícono HelpCircle para KPIs y métricas
 */
export function InfoTooltip({
  text,
  side = "top",
  label = "Más información",
}: {
  text: string;
  side?: "top" | "bottom" | "left" | "right";
  label?: string;
}) {
  return (
    <AppTooltip
      content={<p className="text-[11px] leading-relaxed max-w-[220px] text-slate-200">{text}</p>}
      side={side}
      sideOffset={6}
    >
      <button
        type="button"
        className="text-slate-400 hover:text-[#6E43FF] transition-colors p-0.5 rounded-full focus:outline-hidden cursor-help inline-flex items-center justify-center shrink-0"
        aria-label={label}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
    </AppTooltip>
  );
}
