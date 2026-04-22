import { notFound } from "next/navigation";
import { QuizController } from "@/components/quiz/QuizController";
import { QUESTION_COUNT } from "@/lib/quiz/questions";

type Params = Promise<{ id: string; n: string }>;

export default async function TeamQuestionPage({ params }: { params: Params }) {
  const { id, n } = await params;
  const order = parseInt(n, 10);
  if (!Number.isFinite(order) || order < 1 || order > QUESTION_COUNT) {
    notFound();
  }

  return (
    <QuizController
      order={order}
      storageKey={`velocity-quiz:team:${id}`}
      submitEndpoint={`/api/quiz/team/${id}/submit`}
      questionPathTemplate={`/health-survey/team/${id}/take/question/{n}`}
      startPath={`/health-survey/team/${id}/take`}
    />
  );
}
