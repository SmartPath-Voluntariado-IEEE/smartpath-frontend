"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getModuleQuiz, submitModuleQuiz, syncUserAchievements } from "@/services/api";
import {
  Loader2,
  X,
  Trophy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Zap,
  BookOpen,
  Flame,
  Star,
  RotateCcw,
  Check,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerConfetti } from "@/lib/confetti";
import { evaluateAndUnlockAchievements, type Achievement } from "@/lib/achievements";
import Link from "next/link";

const ICON_MAP: Record<string, any> = {
  Target,
  Award,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  CheckCircle2,
  Star,
};

export function QuizModal({
  moduleId,
  onClose,
  onComplete,
}: {
  moduleId: string;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const { session } = useRequireAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!session) return;
    getModuleQuiz(session.access_token, moduleId)
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, moduleId]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const handleSubmit = async () => {
    if (!session || !allAnswered) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = Object.entries(answers).map(([question_id, selected_option]) => ({
        question_id,
        selected_option,
      }));
      const res = await submitModuleQuiz(session.access_token, moduleId, payload);
      setResult(res);

      if (res.passed) {
        // Disparamos celebración con confeti
        triggerConfetti(2800, 80);

        // Evaluamos logros desbloqueados
        const newlyUnlocked = evaluateAndUnlockAchievements({
          passedModulesCount: 1,
          lastQuizScore: res.score,
          streakDays: 1,
        });

        setUnlockedBadges(newlyUnlocked);

        // Sincronizamos con el backend de forma asíncrona
        if (session.access_token) {
          syncUserAchievements(session.access_token, {
            passed_modules_count: 1,
            last_quiz_score: res.score,
          }).catch((err) => console.warn("Sync achievements backend warning:", err));
        }
      }

      onComplete?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar el examen");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setError(null);
    setUnlockedBadges([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      {/* MODAL CARD */}
      <div
        className={`w-full ${
          result ? "max-w-xl" : "max-w-2xl max-h-[85vh]"
        } flex flex-col rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden relative`}
      >
        {/* Cabecera del Modal */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Evaluación Técnica
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 1. VISTA DE CARGA O ERROR                                 */}
        {/* ========================================================= */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-sm font-medium text-gray-600">
              Generando y preparando preguntas de evaluación...
            </p>
          </div>
        )}

        {error && !loading && !result && (
          <div className="p-6">
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Ocurrió un problema</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. VISTA DE PREGUNTAS (BOTONES ESTABLES SIN JUMP SCROLL)  */}
        {/* ========================================================= */}
        {!loading && !result && questions.length > 0 && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Cuerpo con Scroll para las preguntas */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">
                  Pon a prueba tus conocimientos
                </h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Responde las 10 preguntas de opción múltiple. Requiere al menos un{" "}
                  <strong className="text-gray-900 font-semibold">80% de aciertos</strong> para aprobar el módulo.
                </p>

                {/* Barra de progreso */}
                <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-100 p-3.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-600">
                    Progreso: <strong className="text-primary font-bold">{answeredCount}</strong> de {totalQuestions} respondidas
                  </span>
                  <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Listado de Preguntas */}
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-semibold text-gray-900 text-sm md:text-base leading-snug">
                        {q.question}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {q.options.map((opt: string, idx: number) => {
                        const isSelected = answers[q.id] === idx;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                            className={`w-full text-left flex items-center gap-3.5 rounded-xl border p-3.5 text-xs md:text-sm transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                                : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50/70"
                            }`}
                          >
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                                isSelected
                                  ? "border-primary bg-primary text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                            </div>
                            <span className="flex-1 leading-normal">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Fijo con Botón de Envío */}
            <div className="shrink-0 p-4 px-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-medium">
                {allAnswered ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> ¡Todas las preguntas respondidas!
                  </span>
                ) : (
                  `Faltan ${totalQuestions - answeredCount} preguntas por responder`
                )}
              </span>

              <Button
                className="w-full sm:w-auto gradient-brand text-white px-8 h-11 rounded-xl text-sm font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                disabled={!allAnswered || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Calificando...
                  </span>
                ) : (
                  `Enviar y Calificar (${answeredCount}/${totalQuestions})`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. VISTA DE RESULTADO: APROBADO (≥ 80%)                   */}
        {/* ========================================================= */}
        {result && result.passed && (
          <div className="p-6 md:p-8 text-center flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Icono de éxito */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-100">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="w-full text-center">
              <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-0.5 text-xs font-bold uppercase tracking-wider mb-1.5">
                ¡Módulo Aprobado!
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                ¡Felicitaciones! Has aprobado 🎉
              </h2>
              <p className="mt-1 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Has demostrado dominio en este módulo y tu avance ha quedado registrado exitosamente en tu ruta.
              </p>
            </div>

            {/* Métricas del examen */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="rounded-2xl border border-gray-100 bg-surface-container-low p-3 text-center">
                <span className="block text-xs font-medium text-gray-500">Puntaje</span>
                <strong className="text-lg font-bold text-emerald-600">
                  {result.score}%
                </strong>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-surface-container-low p-3 text-center">
                <span className="block text-xs font-medium text-gray-500">Correctas</span>
                <strong className="text-lg font-bold text-gray-900">
                  {result.correct_answers}/{result.total_questions}
                </strong>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-surface-container-low p-3 text-center">
                <span className="block text-xs font-medium text-gray-500">Requerido</span>
                <strong className="text-lg font-bold text-gray-600">
                  80%
                </strong>
              </div>
            </div>

            {/* Tarjeta de Insignias Desbloqueadas */}
            {unlockedBadges.length > 0 ? (
              <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-orange-50 p-4 text-left shadow-xs w-full max-w-md">
                <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> ¡Nuevo logro desbloqueado!
                </div>
                {unlockedBadges.map((badge) => {
                  const IconComponent = ICON_MAP[badge.iconName] || Trophy;
                  return (
                    <div key={badge.id} className="flex items-center gap-3.5 bg-white/95 rounded-xl p-3 border border-purple-100 shadow-2xs">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6E43FF] to-[#FF8A00] text-white shadow-xs">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display font-bold text-gray-900 text-xs md:text-sm">{badge.title}</h4>
                        <p className="text-[11px] md:text-xs text-gray-600 leading-snug">{badge.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold">
                        +{badge.xpPoints} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-surface-container-low p-3 text-xs text-gray-600 flex items-center justify-center gap-2 w-full max-w-md">
                <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                <span>¡Sigue completando módulos para desbloquear nuevas medallas en tu perfil!</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 w-full max-w-md">
              <Button
                onClick={onClose}
                className="gradient-brand text-white px-5 font-semibold shadow-md h-11 flex-1 text-sm"
              >
                Continuar Aprendiendo <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Link
                href="/perfil#logros"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex-1"
              >
                Ver mis logros 🏆
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. VISTA DE RESULTADO: NO APROBADO (< 80%)                */}
        {/* ========================================================= */}
        {result && !result.passed && (
          <div className="p-6 md:p-8 text-center flex flex-col items-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Icono de advertencia */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-md shadow-amber-100/60">
              <AlertCircle className="h-8 w-8" />
            </div>

            <div className="w-full text-center">
              <span className="inline-block rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3.5 py-0.5 text-xs font-bold uppercase tracking-wider mb-1.5">
                Necesita Refuerzo
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">
                ¡Casi lo logras! 💪
              </h2>
              <p className="mt-1 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Has respondido correctamente <strong className="text-gray-900 font-semibold">{result.correct_answers} de {result.total_questions}</strong> preguntas ({result.score}%). Necesitas alcanzar un <strong className="text-gray-900 font-semibold">80%</strong> para aprobar este módulo.
              </p>
            </div>

            {/* Tarjeta de Resumen de Calificación */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-center">
                <span className="block text-xs font-medium text-amber-800">Tu Puntaje</span>
                <strong className="text-lg font-bold text-amber-700">
                  {result.score}%
                </strong>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
                <span className="block text-xs font-medium text-gray-500">Correctas</span>
                <strong className="text-lg font-bold text-gray-900">
                  {result.correct_answers}/{result.total_questions}
                </strong>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
                <span className="block text-xs font-medium text-gray-500">Mínimo</span>
                <strong className="text-lg font-bold text-gray-700">
                  80%
                </strong>
              </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="rounded-xl bg-surface-container-low p-3.5 text-xs text-gray-600 flex items-center justify-center gap-2 w-full max-w-md">
              <HelpCircle className="h-4 w-4 text-primary shrink-0" />
              <span>Puedes repasar el material del módulo e intentarlo las veces que necesites.</span>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 w-full max-w-md">
              <Button
                onClick={handleRetry}
                className="gradient-brand text-white font-semibold shadow-md h-11 flex-1 text-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reintentar Evaluación
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 text-gray-700 h-11 flex-1 font-semibold text-sm"
              >
                Cerrar y Repasar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}