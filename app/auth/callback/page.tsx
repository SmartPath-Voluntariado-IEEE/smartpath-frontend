'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthExchange = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Guardar opcionalmente el token de acceso en LocalStorage o Cookies para llamadas a tu FastAPI
          localStorage.setItem('access_token', session.access_token);
          
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Error de autenticación:', error.message);
        setErrorMessage('Ocurrió un error al procesar tu inicio de sesión.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleAuthExchange();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="text-center space-y-4">
        {errorMessage ? (
          <p className="text-sm font-semibold text-red-500">{errorMessage}</p>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-zinc-500" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Estableciendo conexión segura y preparando tu sesión...
            </p>
          </>
        )}
      </div>
    </div>
  );
}