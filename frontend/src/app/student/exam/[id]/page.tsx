"use client";

import React, { useState, useEffect } from "react";
import { 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Save, 
  CheckSquare, 
  Circle,
  HelpCircle,
} from "lucide-react";
import ExamStickyHeader from "./components/ExamStickyHeader";
import QuestionNavigator, { QuestionNavItem, QuestionStatus } from "./components/QuestionNavigator";
import { useExam } from "@/context/ExamContext";
import { useAutosave } from "@/hooks/useAutosave";

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
  const {
    activeExamId,
    timeRemaining,
    answers,
    markedForReview,
    isSubmitted,
    startExam,
    selectAnswer,
    clearAnswer,
    toggleMarkForReview,
    submitExam,
  } = useExam();

  const [activeSection, setActiveSection] = useState<string>("Mathematics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [visitedQuestions, setVisitedQuestions] = useState<Record<number, boolean>>({ 1: true });

  const examId = params?.id || "exam-01";

  const { autosaveStatus, lastSavedAt } = useAutosave({ intervalMs: 30000 });

  // Format timestamp for display (e.g. HH:MM:SS or "Just now")
  const formatSavedTime = (date: Date | null) => {
    if (!date) return "at startup";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  // Start exam context on mount if not already initialized
  useEffect(() => {
    if (activeExamId !== examId) {
      startExam(examId, 60); // 60 minutes
    }
  }, [activeExamId, examId, startExam]);

  // Filter questions for the current section
  const sectionQuestions = mockQuestions.filter((q) => q.section === activeSection);
  const currentQuestion = sectionQuestions[currentQuestionIndex] || sectionQuestions[0];

  // Helper to parse stored answer string into option IDs array
  const getSelectedOptionsForQuestion = (qId: number): string[] => {
    const raw = answers[String(qId)];
    if (!raw) return [];
    return raw.split(",");
  };

  const currentSelectedOptions = getSelectedOptionsForQuestion(currentQuestion.id);
  const isCurrentMarked = markedForReview.includes(String(currentQuestion.id));

  const answeredCount = Object.keys(answers).filter((k) => answers[k] && answers[k].length > 0).length;
  const markedCount = markedForReview.length;
  const totalQuestionsCount = mockQuestions.length;
  const unansweredCount = totalQuestionsCount - answeredCount;

  // Build question navigator items for all questions
  const navQuestions: QuestionNavItem[] = mockQuestions.map((q, idx) => {
    const isAns = (getSelectedOptionsForQuestion(q.id)).length > 0;
    const isMrk = markedForReview.includes(String(q.id));
    const isVis = !!visitedQuestions[q.id];

    let status: QuestionStatus = "not_visited";
    if (isMrk) {
      status = "marked";
    } else if (isAns) {
      status = "answered";
    } else if (isVis) {
      status = "unanswered";
    }

    return {
      id: q.id,
      questionNumber: idx + 1,
      section: q.section,
      status,
    };
  });

  const notVisitedCount = navQuestions.filter((q) => q.status === "not_visited").length;
  const unansweredNavCount = navQuestions.filter((q) => q.status === "unanswered").length;

  const handleSelectQuestionById = (qId: number) => {
    const targetQ = mockQuestions.find((q) => q.id === qId);
    if (!targetQ) return;

    if (targetQ.section !== activeSection) {
      setActiveSection(targetQ.section);
    }
    const secIdx = mockQuestions.filter((q) => q.section === targetQ.section).findIndex((q) => q.id === qId);
    setCurrentQuestionIndex(secIdx !== -1 ? secIdx : 0);
    setVisitedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const handleOptionSelect = (optionId: string) => {
    selectAnswer(String(currentQuestion.id), optionId, currentQuestion.type === "multiple");
    setVisitedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
  };

  const handleClearResponse = () => {
    clearAnswer(String(currentQuestion.id));
  };

  const handleToggleMarkForReview = () => {
    toggleMarkForReview(String(currentQuestion.id));
    setVisitedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < sectionQuestions.length - 1) {
      const nextQ = sectionQuestions[currentQuestionIndex + 1];
      setCurrentQuestionIndex((prev) => prev + 1);
      setVisitedQuestions((prev) => ({ ...prev, [nextQ.id]: true }));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevQ = sectionQuestions[currentQuestionIndex - 1];
      setCurrentQuestionIndex((prev) => prev - 1);
      setVisitedQuestions((prev) => ({ ...prev, [prevQ.id]: true }));
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
      case "Medium":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
      case "Hard":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 text-center transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-full flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Exam Submitted Successfully!</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Your answers have been securely recorded and synced. Results will be announced by your administrator.
          </p>
          <button
            onClick={() => (window.location.href = "/student/dashboard")}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold rounded-xl transition-all shadow-sm text-sm"
          >
            Return to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Sticky Top Header Component */}
      <ExamStickyHeader
        examTitle="Advanced Mathematics & Physics Entrance Assessment 2026"
        studentName="Alex Morgan"
        studentId="STU-892401"
        timeRemaining={timeRemaining}
        autosaveStatus={autosaveStatus}
        lastSavedText={formatSavedTime(lastSavedAt)}
        totalQuestions={totalQuestionsCount}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedCount}
        onSubmitExam={submitExam}
      />

      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Subject Tabs & Main Question Interface */}
        <div className="flex-1 flex flex-col">
          {/* Subject / Section Tab Switcher */}
          <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6 overflow-x-auto">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-2">
              Sections:
            </span>
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setActiveSection(sec);
                  setCurrentQuestionIndex(0);
                  const firstSecQ = mockQuestions.find((q) => q.section === sec);
                  if (firstSecQ) {
                    setVisitedQuestions((prev) => ({ ...prev, [firstSecQ.id]: true }));
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === sec
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Main Question Card Container */}
          <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Question Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                  <span className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold px-3 py-1 rounded-md text-sm">
                    Question {currentQuestionIndex + 1} of {sectionQuestions.length}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${getDifficultyBadge(
                      currentQuestion.difficulty
                    )}`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                    {currentQuestion.type === "single"
                      ? "Single Choice"
                      : "Multiple Choice"}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">+{currentQuestion.points} Marks</span>
                  <span>/</span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-medium">-{currentQuestion.negativePoints} Marks</span>
                  {isCurrentMarked && (
                    <span className="flex items-center gap-1 text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 font-semibold">
                      <Bookmark className="w-3 h-3 fill-zinc-900 dark:fill-zinc-100" /> Marked
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="my-6">
                <p className="text-lg md:text-xl font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
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
                          ? "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-900 dark:ring-zinc-100"
                          : "bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className="mt-0.5 mr-3 flex-shrink-0">
                        {currentQuestion.type === "single" ? (
                          <Circle
                            className={`w-5 h-5 ${
                              isSelected
                                ? "fill-zinc-900 text-zinc-900 dark:fill-zinc-100 dark:text-zinc-100"
                                : "text-zinc-400"
                            }`}
                          />
                        ) : (
                          <CheckSquare
                            className={`w-5 h-5 ${
                              isSelected ? "text-zinc-900 dark:text-zinc-100 fill-zinc-200 dark:fill-zinc-800" : "text-zinc-400"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-zinc-400 dark:text-zinc-500 mr-2">{option.id}.</span>
                        <span className="text-base">{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="pt-6 mt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleMarkForReview}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    isCurrentMarked
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                      : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isCurrentMarked ? "fill-white dark:fill-zinc-900" : ""}`} />
                  <span>{isCurrentMarked ? "Unmark Review" : "Mark for Review"}</span>
                </button>

                <button
                  onClick={handleClearResponse}
                  disabled={currentSelectedOptions.length === 0}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear Response</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleSaveAndNext}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Navigator Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <QuestionNavigator
            questions={navQuestions}
            currentQuestionId={currentQuestion.id}
            onSelectQuestion={handleSelectQuestionById}
            summary={{
              total: totalQuestionsCount,
              answered: answeredCount,
              unanswered: unansweredNavCount,
              marked: markedCount,
              notVisited: notVisitedCount,
            }}
          />
        </div>
      </div>
    </div>
  );
}
