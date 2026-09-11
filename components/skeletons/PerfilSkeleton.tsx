import { Skeleton } from "@/components/ui/skeleton";

export function PerfilSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-10 space-y-6 animate-in fade-in-50 duration-300">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <Skeleton className="h-20 w-20 rounded-full shrink-0" />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <Skeleton className="h-7 w-48 mx-auto sm:mx-0 rounded-xl" />
          <Skeleton className="h-4 w-60 mx-auto sm:mx-0 rounded-md" />
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <Skeleton className="h-5 w-48 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <Skeleton className="h-5 w-44 rounded-md" />
        <div className="flex flex-wrap gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <Skeleton key={s} className="h-8 w-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
