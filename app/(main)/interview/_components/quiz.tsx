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

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

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
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      const cleanedAnswers = answers.map((a) => a ?? "");
      await saveQuizResultFn(quizData, cleanedAnswers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to save quiz results");
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
      <div className="px-6 py-6">
        <BarLoader className="mt-4" width={"100%"} color="gray" />
      </div>
    );
  }

  // Quiz Completed → Show Result
  if (resultData) {
    const safeResult: QuizResultType = {
      quizScore: resultData.quizScore,
      improvementTip: resultData.improvementTip,
      questions: resultData.questions as QuestionResult[],
    };

    return (
      <div className="mx-2 md:mx-auto max-w-3xl">
        <QuizResult result={safeResult} onStartNew={startNewQuiz} />
      </div>
    );
  }

  // Start Page
  if (!quizData) {
    return (
      <Card className="mx-2 md:mx-auto max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Ready to test your knowledge?
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This quiz contains 10 questions tailored to your skills and
            expertise. Select the best answer to each question.
          </p>
        </CardContent>

        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full h-11">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2 md:mx-auto max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="text-base md:text-lg font-medium leading-snug">
          {question.question}
        </p>

        {/* Options */}
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion] || ""}
          className="space-y-3"
        >
          {question.options.map((option: string, index: number) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer"
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-sm md:text-base">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 transition-all">
            <p className="font-medium text-sm mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-3">
        {!showExplanation && (
          <Button
            variant="outline"
            onClick={() => setShowExplanation(true)}
            disabled={!answers[currentQuestion]}
            className="h-10 px-4 border-neutral-300 dark:border-white/20"
          >
            Show Explanation
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto h-10 px-6"
        >
          {savingResult ? (
            <BarLoader width={"100%"} color="gray" />
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
