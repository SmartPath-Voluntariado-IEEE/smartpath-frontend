import { cn } from "@/lib/utils";

/**
 * Primitiva base Skeleton inspirada en Shadcn UI
 * Proporciona un bloque pulsante ultra-ligero y adaptable a cualquier tamaño
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  );
}
