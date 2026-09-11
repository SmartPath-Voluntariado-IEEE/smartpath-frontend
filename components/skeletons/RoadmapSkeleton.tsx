import { Skeleton } from "@/components/ui/skeleton";

export function RoadmapSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 md:py-10 space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. Header del Roadmap */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 border border-slate-200/70 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-xl" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-40 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      </div>

      {/* 2. Título de sección */}
      <div className="space-y-1">
        <Skeleton className="h-6 w-44 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </div>

      {/* 3. Niveles del Roadmap (LevelRows) */}
      <div className="space-y-4">
        {[1, 2, 3].map((lvl) => (
          <div key={lvl} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {[1, 2, 3].map((card) => (
                <div key={card} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
