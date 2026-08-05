"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { supabase } from "@/lib/supabaseClient";
import { getBackendProfile, isOnboardingComplete } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          try {
            localStorage.setItem("access_token", session.access_token);
            const profile = await getBackendProfile(session.access_token);
            // Si el chatbot dejó el perfil a medias, retomamos el onboarding.
            router.push(isOnboardingComplete(profile) ? "/dashboard" : "/onboarding");
            return;
          } catch (profileErr) {
            console.log("Sesión previa expirada o no válida en backend:", profileErr);
            localStorage.removeItem("access_token");
            await supabase.auth.signOut({ scope: "local" }).catch(() => {});
          }
        }
      } catch (err) {
        console.error("Error comprobando sesión en login:", err);
      } finally {
        setChecking(false);
      }
    }
    checkExistingSession();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-[90%] sm:w-[440px] px-4 py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-container/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary-container/20 blur-3xl" />
      </div>

      <div className="surface-card p-8 text-center bg-white">
        <div className="mx-auto flex h-14 w-14 items-center justify-center">
          <img src="/favicon.png" alt="SmartPath Logo" className="h-20 w-auto object-contain" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-on-surface">Bienvenido a SmartPath</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Tu ruta inteligente hacia el empleo tech. Inicia sesión para empezar.
        </p>

        <div className="mt-8 space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative bg-white px-4 text-xs font-semibold text-on-surface-variant uppercase">
              Método de acceso
            </div>
          </div>

          <GoogleLoginButton />
        </div>

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          Al continuar aceptas nuestros términos. Este es un MVP: los datos se guardan en tu navegador de forma segura.
        </p>
      </div>
    </div>
  );
}