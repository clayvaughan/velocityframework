import { notFound } from "next/navigation";
import { QuizController } from "@/components/quiz/QuizController";
import { QUESTION_COUNT } from "@/lib/quiz/questions";

export const dynamic = "force-static";

export function generateStaticParams() {
  return Array.from({ length: QUESTION_COUNT }, (_, i) => ({
    n: String(i + 1),
  }));
}

type Params = Promise<{ n: string }>;

export default async function QuestionPage({ params }: { params: Params }) {
  const { n } = await params;
  const order = parseInt(n, 10);
  if (!Number.isFinite(order) || order < 1 || order > QUESTION_COUNT) {
    notFound();
  }

  return (
    <QuizController
      order={order}
      storageKey="velocity-quiz:individual"
      submitEndpoint="/api/quiz/submit"
      questionPathTemplate="/health-survey/question/{n}"
      startPath="/health-survey/start"
    />
  );
}
