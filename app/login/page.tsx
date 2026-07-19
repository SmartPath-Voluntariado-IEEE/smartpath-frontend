'use client';

import GoogleLoginButton from '@/components/GoogleLoginButton';
import { Compass } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm dark:border-zinc-900 dark:bg-zinc-900">
        <div className="flex flex-col items-center text-center">
          {/* Logo o Icono de la plataforma */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Ingresar a SmartPath
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Accede a tu plataforma de forma rápida y segura
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative bg-white px-4 text-xs font-semibold text-zinc-400 uppercase dark:bg-zinc-900">
              Método de acceso
            </div>
          </div>

          {/* Botón interactivo de OAuth */}
          <GoogleLoginButton />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Al iniciar sesión, aceptas nuestros Términos de Servicio y Políticas de Privacidad.
        </p>
      </div>
    </div>
  );
}