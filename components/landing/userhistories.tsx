"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Backend Developer Junior",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
    quote: "“Conseguí mi primer empleo en 3 meses”",
    badge: "De estudiante a empleado en 90 días",
    badgeColor: "bg-[#EDE9FE] text-[#6E43FF] border-[#DDD6FE]",
  },
  {
    name: "Ana L.",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    quote: "“Por fin supe qué estudiar. Dejé de perder tiempo.”",
    badge: "Prácticas → Full-time",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    name: "Miguel R.",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
    quote: "“La confianza de saber que aprendí lo que el mercado necesita”",
    badge: "Cambio de carrera exitoso",
    badgeColor: "bg-orange-50 text-orange-600 border-orange-200",
  },
];

export function LandingUserHistories() {
  return (
    <section id="casos-de-exito" className="relative bg-[#F8FAFC] text-slate-900 py-20 md:py-28 px-6 overflow-hidden z-10 font-sans border-t border-slate-200/70">
      
      {/* Luz de fondo sutil */}
      <div className="absolute bottom-10 left-1/3 w-[700px] h-[500px] bg-purple-100/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-14 md:space-y-18">

        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#6E43FF] border border-[#DDD6FE]">
            <span className="w-5 h-5 rounded-full bg-[#6E43FF] text-white flex items-center justify-center text-xs font-bold font-display">
              08
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              HISTORIAS DE ÉXITO
            </span>
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight">
            Ellos ya transformaron{" "}
            <span className="block sm:inline">su carrera</span>
          </h2>
        </div>

        {/* 3 Tarjetas de Historias de Éxito en Grid con Espacio Generoso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((user, i) => (
            <div
              key={i}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300/80 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Avatar y Datos */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100 shadow-xs"
                  />
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#6E43FF] transition-colors">
                      {user.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium block">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Cita */}
                <p className="text-sm sm:text-base text-slate-700 font-medium italic leading-relaxed pt-1">
                  {user.quote}
                </p>
              </div>

              {/* Badge de Logro */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border ${user.badgeColor}`}>
                  {user.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Fila Inferior de Impacto y Métricas Globales */}
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* Métrica 1 */}
          <div className="flex flex-col justify-center items-center py-2 sm:py-0">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#6E43FF] leading-none">
              92%
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
              consiguió empleo en 6 meses
            </span>
          </div>

          {/* Métrica 2 */}
          <div className="flex flex-col justify-center items-center py-2 sm:py-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-none">
                4.9/5
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              rating promedio de satisfacción
            </span>
          </div>

          {/* Métrica 3 */}
          <div className="flex flex-col justify-center items-center py-2 sm:py-0">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#6E43FF] leading-none">
              3 meses
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
              tiempo promedio de inserción
            </span>
          </div>

        </div>

      </div>

    </section>
  );
}
