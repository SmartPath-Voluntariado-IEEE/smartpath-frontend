"use client";

import Link from "next/link";

import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/perfil", label: "Perfil" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/cursos", label: "Cursos" },
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const { profile, hydrated, clear } = useProfile();
  const isAuthed = hydrated && !!profile;
  const router = useRouter();

  // Ocultar el navbar durante el flujo de onboarding
  if (pathname === "/onboarding") {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    localStorage.removeItem("access_token");
    clear();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/img/logo.png" alt="SmartPath Logo" className="h-15 w-auto object-contain" />
        </Link>

        {isAuthed && (
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
              <span className="hidden text-sm text-on-surface-variant sm:inline">
                {profile?.fullName || profile?.email}
              </span>
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
