// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import axios from 'axios';
import { LogOut, User, ShieldCheck, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        // 1. Obtener la sesión activa de Supabase
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          // Si no hay sesión válida en el frontend, redirigir al login
          router.push('/login');
          return;
        }

        // 2. Hacer la petición a tu API de FastAPI enviando el Bearer token
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        // Almacenamos la información devuelta por el backend
        setUserData(response.data.user_details);
      } catch (err) {
        console.error('Error al conectar con el backend:', err);
        // Si el backend rechaza el token por inválido, mandamos al login
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, [router]);

  // Manejar el cierre de sesión de forma segura
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Barra de navegación superior */}
        <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-6 shadow-xs dark:border-zinc-900 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2 text-green-600 dark:bg-green-950/30 dark:text-green-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-950 dark:text-white">Panel de Control</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Acceso seguro validado por FastAPI</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>

        {/* Tarjeta de información del usuario */}
        <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-xs dark:border-zinc-900 dark:bg-zinc-900">
          <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-6">Datos de tu cuenta</h2>
          
          {userData ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Avatar de usuario"
                  className="h-20 w-20 rounded-full border border-zinc-200 dark:border-zinc-800"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <User className="h-10 w-10 text-zinc-400" />
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Nombre de Google</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{userData.name || 'No disponible'}</p>
                
                <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Correo Electrónico</p>
                <p className="text-zinc-900 dark:text-white">{userData.email}</p>
                
                <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Identificador Único (UID)</p>
                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{userData.id}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500">No se pudieron recuperar tus datos desde el backend.</p>
          )}
        </div>

      </div>
    </div>
  );
}