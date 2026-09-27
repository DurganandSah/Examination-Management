"use client";

import React, { useState } from "react";
import { 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Save, 
  CheckSquare, 
  Circle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  section: string;
  questionText: string;
  type: "single" | "multiple";
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  negativePoints: number;
  options: Option[];
}

// Mock question dataset per section
const mockQuestions: Question[] = [
  {
    id: 1,
    section: "Mathematics",
    questionText: "What is the derivative of f(x) = x^3 + 3x^2 - 5x + 7 with respect to x?",
    type: "single",
    difficulty: "Medium",
    points: 4,
    negativePoints: 1,
    options: [
      { id: "A", text: "3x^2 + 6x - 5" },
      { id: "B", text: "3x^2 + 3x - 5" },
      { id: "C", text: "x^2 + 6x - 5" },
      { id: "D", text: "3x^2 + 6x + 7" },
    ],
  },
  {
    id: 2,
    section: "Mathematics",
    questionText: "Which of the following matrices are invertible? (Select all that apply)",
    type: "multiple",
    difficulty: "Hard",
    points: 4,
    negativePoints: 1,
    options: [
      { id: "A", text: "Identity matrix I_n" },
      { id: "B", text: "Matrix with determinant equal to 0" },
      { id: "C", text: "Diagonal matrix with all non-zero diagonal elements" },
      { id: "D", text: "Zero matrix O_n" },
    ],
  },
  {
    id: 3,
    section: "Physics",
    questionText: "According to Kepler's second law of planetary motion, the areal velocity of a planet revolving around the sun is constant. This is a consequence of conservation of:",
    type: "single",
    difficulty: "Easy",
    points: 4,
    negativePoints: 1,
    options: [
      { id: "A", text: "Linear Momentum" },
      { id: "B", text: "Angular Momentum" },
      { id: "C", text: "Energy" },
      { id: "D", text: "Mass" },
    ],
  },
  {
    id: 4,
    section: "Logic",
    questionText: "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
    type: "single",
    difficulty: "Medium",
    points: 4,
    negativePoints: 1,
    options: [
      { id: "A", text: "EOJDJEFM" },
      { id: "B", text: "EOJDEJFM" },
      { id: "C", text: "MFEJDJOE" },
      { id: "D", text: "MFEJDJEO" },
    ],
  },
];

const sections = ["Mathematics", "Physics", "Logic"];

export default function StudentExamPage({ params }: { params: { id: string } }) {
  const [activeSection, setActiveSection] = useState<string>("Mathematics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // User response state: object mapping questionId to array of selected option IDs
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  // Filter questions for the current section
  const sectionQuestions = mockQuestions.filter((q) => q.section === activeSection);
  const currentQuestion = sectionQuestions[currentQuestionIndex] || sectionQuestions[0];

  const currentSelectedOptions = selectedAnswers[currentQuestion.id] || [];
  const isCurrentMarked = !!markedForReview[currentQuestion.id];

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion.type === "single") {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: [optionId],
      }));
    } else {
      // Multiple selection toggle
      const existing = selectedAnswers[currentQuestion.id] || [];
      const updated = existing.includes(optionId)
        ? existing.filter((id) => id !== optionId)
        : [...existing, optionId];
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: updated,
      }));
    }
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleToggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 md:p-6 max-w-6xl mx-auto w-full">
      {/* Subject / Section Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
          Sections:
        </span>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => {
              setActiveSection(sec);
              setCurrentQuestionIndex(0);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeSection === sec
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Main Question Card Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          {/* Question Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold px-3 py-1 rounded-md text-sm">
                Question {currentQuestionIndex + 1} of {sectionQuestions.length}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${getDifficultyBadge(
                  currentQuestion.difficulty
                )}`}
              >
                {currentQuestion.difficulty}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                {currentQuestion.type === "single"
                  ? "Single Choice"
                  : "Multiple Choice"}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">+{currentQuestion.points} Marks</span>
              <span>/</span>
              <span className="text-rose-400 font-medium">-{currentQuestion.negativePoints} Marks</span>
              {isCurrentMarked && (
                <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-medium">
                  <Bookmark className="w-3 h-3 fill-amber-400" /> Marked
                </span>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="my-6">
            <p className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
              {currentQuestion.questionText}
            </p>
          </div>

          {/* Option Selector */}
          <div className="space-y-3 mt-4">
            {currentQuestion.options.map((option) => {
              const isSelected = currentSelectedOptions.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full flex items-start text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-indigo-950/60 border-indigo-500 text-indigo-100 shadow-md ring-1 ring-indigo-500/50"
                      : "bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700"
                  }`}
                >
                  <div className="mt-0.5 mr-3 flex-shrink-0">
                    {currentQuestion.type === "single" ? (
                      <Circle
                        className={`w-5 h-5 ${
                          isSelected
                            ? "fill-indigo-500 text-indigo-500"
                            : "text-slate-500"
                        }`}
                      />
                    ) : (
                      <CheckSquare
                        className={`w-5 h-5 ${
                          isSelected ? "text-indigo-400 fill-indigo-950" : "text-slate-500"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-400 mr-2">{option.id}.</span>
                    <span className="text-base">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-6 mt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleMarkForReview}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                isCurrentMarked
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isCurrentMarked ? "fill-amber-400" : ""}`} />
              <span>{isCurrentMarked ? "Unmark Review" : "Mark for Review"}</span>
            </button>

            <button
              onClick={handleClearResponse}
              disabled={currentSelectedOptions.length === 0}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Response</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleSaveAndNext}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
