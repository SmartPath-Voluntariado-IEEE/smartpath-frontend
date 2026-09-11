"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import { LayoutDashboard, GitMerge, BookOpen, Briefcase, UserCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: GitMerge },
  { href: "/cursos", label: "Cursos", icon: BookOpen },
  { href: "/bolsa-laboral", label: "Bolsa", icon: Briefcase },
  { href: "/perfil", label: "Perfil", icon: UserCircle },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { profile, hydrated } = useProfile();

  const isLanding = pathname === "/" || pathname === "/landing" || pathname === "/onboarding";
  const isAuthed = hydrated && !!profile && !isLanding;

  if (!isAuthed) {
    return null;
  }

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-[0_-4px_20px_rgba(13,17,51,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? "text-[#6E43FF] bg-[#F3F0FF] font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
