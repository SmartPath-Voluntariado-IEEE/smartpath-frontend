"use client";

import Link from "next/link";

import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle, Compass } from "lucide-react";
import { useSmartPathTour } from "@/components/tour/SmartPathTourProvider";

const NAV = [
  { href: "/dashboard", label: "Dashboard", tourId: "nav-dashboard" },
  { href: "/roadmap", label: "Roadmap", tourId: "nav-roadmap" },
  { href: "/cursos", label: "Cursos", tourId: "nav-cursos" },
  { href: "/bolsa-laboral", label: "Bolsa laboral", tourId: "nav-bolsa" },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const { profile, hydrated, clear } = useProfile();
  const isLanding = pathname === "/";
  const isAuthed = hydrated && !!profile && !isLanding;
  const router = useRouter();
  const { startTour } = useSmartPathTour();

  if (pathname === "/" || pathname === "/landing" || pathname === "/onboarding") {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    localStorage.removeItem("access_token");
    clear();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/img/logo.png" alt="SmartPath Logo" className="h-15 w-auto object-contain" />
        </Link>

        {isAuthed && (
          <nav data-tour="nav-sections" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-tour={item.tourId}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-[#F3F0FF] text-[#6E43FF] font-semibold" : "text-[#6B7280] hover:text-[#6E43FF]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <button
                type="button"
                onClick={startTour}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-surface-variant px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition-all shadow-2xs"
                title="Repasar tour guiado de SmartPath"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Tour guiado</span>
              </button>

              <Link
                href="/perfil"
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                  pathname.startsWith("/perfil")
                    ? "bg-[#F3F0FF] text-[#6E43FF] font-semibold"
                    : "text-[#6B7280] hover:text-[#6E43FF]"
                }`}
              >
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {profile?.fullName || profile?.email}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </header>
  );
}