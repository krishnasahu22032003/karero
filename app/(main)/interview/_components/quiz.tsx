"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult, { QuizResultType, QuestionResult } from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const { loading: generatingQuiz, fn: generateQuizFn, data: quizData } =
    useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer: string) => {
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((a, i) => {
      if (a === quizData[i].correctAnswer) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    try {
      const score = calculateScore();
      await saveQuizResultFn(
        quizData,
        answers.map((a) => a ?? ""),
        score
      );
      toast.success("Quiz completed!");
    } catch (e) {
      toast.error("Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(undefined);
  };

  if (generatingQuiz) {
    return (
      <div className="px-6">
        <BarLoader width="100%" color="#888" />
      </div>
    );
  }

  if (resultData) {
    const safeResult: QuizResultType = {
      quizScore: resultData.quizScore,
      improvementTip: resultData.improvementTip,
      questions: resultData.questions as QuestionResult[],
    };

    return (
      <div className="max-w-3xl mx-auto">
        <QuizResult result={safeResult} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle className="tracking-tight">
            Ready to test your knowledge?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This quiz contains 10 industry-specific questions. Choose the best
            answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full h-11 cursor-pointer">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="tracking-tight">
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-base md:text-lg font-medium leading-snug">
          {question.question}
        </p>

        <RadioGroup
          value={answers[currentQuestion] || ""}
          onValueChange={handleAnswer}
          className="space-y-3"
        >
          {question.options.map((option: string, idx: number) => {
            const selected = answers[currentQuestion] === option;
            return (
              <label
                key={idx}
                htmlFor={`opt-${idx}`}
                className={`
                  flex items-center gap-3 rounded-lg p-4 cursor-pointer
                  border transition-all
                  ${
                    selected
                      ? "border-neutral-400 dark:border-white/30 bg-neutral-100 dark:bg-neutral-800"
                      : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }
                `}
              >
                <RadioGroupItem value={option} id={`opt-${idx}`} />
                <span className="text-sm md:text-base">{option}</span>
              </label>
            );
          })}
        </RadioGroup>

        {showExplanation && (
          <div className="rounded-xl p-4 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10">
            <p className="text-sm font-medium mb-1">Explanation</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>

     <CardFooter className="flex flex-col-reverse sm:flex-row gap-3">

        {!showExplanation && (
          <Button
            variant="outline"
            disabled={!answers[currentQuestion]}
            onClick={() => setShowExplanation(true)}
            className="border-neutral-300 dark:border-white/20 cursor-pointer"
          >
            Show Explanation
          </Button>
        )}

    <Button
  onClick={handleNext}
  disabled={!answers[currentQuestion] || savingResult}
  className="w-full sm:w-auto sm:ml-auto cursor-pointer"
>
  {savingResult && currentQuestion === quizData.length - 1 ? (
    <span className="flex items-center gap-2">
      <BarLoader width={60} height={4} color="#888" />
      <span className="sr-only">Submitting</span>
    </span>
  ) : currentQuestion < quizData.length - 1 ? (
    "Next Question"
  ) : (
    "Finish Quiz"
  )}
</Button>

      </CardFooter>
    </Card>
  );
}
