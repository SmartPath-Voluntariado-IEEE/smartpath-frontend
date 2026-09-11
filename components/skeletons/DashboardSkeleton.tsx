import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-28 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-100 border border-slate-200/70 flex flex-col justify-between min-h-[290px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-14 w-28 rounded-2xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <div className="pt-6 border-t border-slate-200/60 flex items-center justify-between">
            <Skeleton className="h-4 w-52 rounded-md" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[290px]">
          <div className="space-y-3">
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
          </div>
          <div className="pt-4 flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 3. Grid Inferior: Cursos/Roadmap + KPIs/Skills */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Izquierda (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Mis Cursos Activos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-36 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap Resumen */}
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-6 w-44 rounded-lg" />
                <Skeleton className="h-4 w-60 rounded-md" />
              </div>
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div key={lvl} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-center flex flex-col items-center">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-3 w-12 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (4 cols): 2x2 KPIs + Top Skills */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cuadrícula 2x2 KPIs */}
          <div className="grid grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((kpi) => (
              <div key={kpi} className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs min-h-[112px] flex flex-col justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
                <Skeleton className="h-3 w-14 rounded-md" />
              </div>
            ))}
          </div>

          {/* Top Skills Demandadas */}
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="space-y-3 pt-1">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
