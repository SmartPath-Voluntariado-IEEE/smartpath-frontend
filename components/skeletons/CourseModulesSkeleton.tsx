import { Skeleton } from "@/components/ui/skeleton";

export function CourseModulesSkeleton() {
  return (
    <div className="min-h-full bg-[#fbfaff]">
      <main className="mx-auto max-w-[1000px] px-5 py-6 sm:px-8 lg:px-10 space-y-6 animate-in fade-in-50 duration-300">
        <Skeleton className="h-8 w-44 rounded-full" />

        <div className="relative overflow-hidden rounded-2xl border border-[#ece9f7] bg-white shadow-[0_10px_30px_rgba(72,36,175,.05)]">
          <div className="h-48 w-full bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse" />
          <div className="p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-4/5 max-w-xl rounded-xl" />
            <Skeleton className="h-4 w-full max-w-2xl rounded-md" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 space-y-2">
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Skeleton className="h-10 w-44 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#ece9f7] bg-white p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-64 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#ece9f7] bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-4 w-full max-w-lg rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
