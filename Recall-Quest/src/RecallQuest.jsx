import { useState } from "react";
import QuizCard from "./QuizCard";
import FlashcardItem from "./FlashcardItem";

export default function RecallQuest() {
  const [mode, setMode] = useState("quiz");

  const sampleQuestion = {
    question: "What does HTTP stand for?",
    options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyper Transfer Text Program", "None"],
    correctAnswer: 0,
    explanation: "HTTP stands for HyperText Transfer Protocol."
  };

  const sampleCard = {
    front: "What is CPU?",
    back: "Central Processing Unit"
  };

  return (
    <div className="space-y-4">

      <div className="flex gap-2">
        <button onClick={() => setMode("quiz")} className="px-3 py-1 border rounded">
          Quiz
        </button>
        <button onClick={() => setMode("flash")} className="px-3 py-1 border rounded">
          Flashcards
        </button>
      </div>

      {mode === "quiz" && (
        <QuizCard question={sampleQuestion} onAnswer={() => {}} />
      )}

      {mode === "flash" && (
        <FlashcardItem card={sampleCard} onReview={() => {}} />
      )}

    </div>
  );
}