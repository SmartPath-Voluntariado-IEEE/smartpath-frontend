import { Skeleton } from "@/components/ui/skeleton";

export function BolsaLaboralSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10 space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="flex flex-wrap gap-2 pt-1">
          {[1, 2, 3, 4].map((f) => (
            <Skeleton key={f} className="h-8 w-28 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-52 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 self-end md:self-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
