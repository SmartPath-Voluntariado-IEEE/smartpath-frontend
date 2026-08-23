import { LandingHero } from "@/components/landing/hero";
import { LandingProblem } from "@/components/landing/problem";
import { LandingInsight } from "@/components/landing/insight";
import { LandingHowItWorks } from "@/components/landing/howitsworks";
import { LandingSolution } from "@/components/landing/solution";
import { LandingWhy } from "@/components/landing/why";
import { LandingKPIs } from "@/components/landing/kpis";
import { LandingUserHistories } from "@/components/landing/userhistories";
import { LandingCTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060718] text-white selection:bg-purple-500 selection:text-white font-sans">
      {/* 01. Hero Section */}
      <LandingHero />

      {/* 02. Sección El Problema */}
      <LandingProblem />

      {/* 03. Sección Insight */}
      <LandingInsight />

      {/* 04. Sección Cómo Funciona */}
      <LandingHowItWorks />

      {/* 05. Sección La Plataforma / Solución */}
      <LandingSolution />

      {/* 06. Sección Por Qué Smartpath */}
      <LandingWhy />

      {/* 07. Sección Impacto Real / KPIs */}
      <LandingKPIs />

      {/* 08. Sección Historias de Éxito */}
      <LandingUserHistories />

      {/* 09. Sección Final Call to Action */}
      <LandingCTA />
    </div>
  );
}
