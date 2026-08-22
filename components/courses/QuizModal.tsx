"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { getModuleQuiz, submitModuleQuiz } from "@/services/api";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (!session) return;
    getModuleQuiz(session.access_token, moduleId)
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session, moduleId]);

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <X className="h-5 w-5" />
        </button>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && <p className="text-destructive text-sm">{error}</p>}

        {!loading && !result && questions.length > 0 && (
          <>
            <h2 className="font-display text-xl font-bold mb-4">Examen del módulo</h2>
            <div className="space-y-6">
              {questions.map((q, i) => (
                <div key={q.id}>
                  <p className="font-medium text-on-surface mb-2">
                    {i + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt: string, idx: number) => (
                      <label
                        key={idx}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm cursor-pointer transition-colors ${
                          answers[q.id] === idx
                            ? "border-primary bg-primary/5"
                            : "border-outline-variant"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id] === idx}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="mt-6 w-full gradient-brand text-white"
              disabled={!allAnswered || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Enviando..." : "Enviar respuestas"}
            </Button>
          </>
        )}

        {result && (
          <div className="text-center py-8">
            <h2 className="font-display text-2xl font-bold">
              {result.passed ? "🎉 ¡Aprobado!" : "Falta validar"}
            </h2>
            <p className="mt-2 text-on-surface-variant">
              {result.correct_answers}/{result.total_questions} correctas ({result.score}%)
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {result.passed
                ? "Módulo completado."
                : "Necesitas al menos 8/10 para aprobar."}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              {!result.passed && (
                <Button variant="outline" onClick={handleRetry}>
                  Reintentar
                </Button>
              )}
              <Button onClick={onClose}>Cerrar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}