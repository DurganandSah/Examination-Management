"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Bookmark, HelpCircle, Filter } from "lucide-react";

export type QuestionStatus = "answered" | "unanswered" | "marked" | "not_visited";

export interface QuestionNavItem {
  id: number;
  questionNumber: number;
  section: string;
  status: QuestionStatus;
}

interface QuestionNavigatorProps {
  questions: QuestionNavItem[];
  currentQuestionId: number;
  onSelectQuestion: (questionId: number) => void;
  summary: {
    total: number;
    answered: number;
    unanswered: number;
    marked: number;
    notVisited: number;
  };
  className?: string;
}

type FilterOption = "all" | "answered" | "unanswered" | "marked" | "not_visited";

export default function QuestionNavigator({
  questions,
  currentQuestionId,
  onSelectQuestion,
  summary,
  className = "",
}: QuestionNavigatorProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "answered") return q.status === "answered";
    if (activeFilter === "unanswered") return q.status === "unanswered";
    if (activeFilter === "marked") return q.status === "marked";
    if (activeFilter === "not_visited") return q.status === "not_visited";
    return true;
  });

  const getStatusBadgeStyle = (status: QuestionStatus, isCurrent: boolean) => {
    const base = "relative flex items-center justify-center font-bold text-xs rounded-xl transition-all duration-200 border cursor-pointer select-none h-10 w-full";
    const currentRing = isCurrent ? "ring-2 ring-zinc-900 dark:ring-zinc-100 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 scale-[1.02] z-10 font-extrabold" : "";

    switch (status) {
      case "answered":
        // Solid monochrome/dark badge with check indicator
        return `${base} ${currentRing} bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm`;
      case "marked":
        // Amber/Yellow subtle highlight dot or badge
        return `${base} ${currentRing} bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 dark:border-amber-500/40 hover:bg-amber-500/20 dark:hover:bg-amber-500/30`;
      case "unanswered":
        // Muted gray/zinc border badge
        return `${base} ${currentRing} bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700/80`;
      case "not_visited":
      default:
        // Border-only badge
        return `${base} ${currentRing} bg-transparent text-zinc-500 dark:text-zinc-400 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50`;
    }
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm ${className}`}>
      {/* Header & Overall Summary Counter */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Question Palette</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Quick jump & status overview</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-full">
            {summary.answered} of {summary.total} Answered
          </span>
        </div>
      </div>

      {/* Filter Toggles */}
      <div className="py-3.5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-1 mb-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Filter View
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "all", label: `All (${summary.total})` },
              { id: "answered", label: `Answered (${summary.answered})` },
              { id: "unanswered", label: `Unanswered (${summary.unanswered})` },
              { id: "marked", label: `Review (${summary.marked})` },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend / Status Badges Explanation */}
      <div className="py-3 border-b border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-zinc-900 dark:bg-zinc-100 inline-block flex-shrink-0" />
          <span className="text-zinc-600 dark:text-zinc-400 truncate">Answered ({summary.answered})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 inline-block flex-shrink-0" />
          <span className="text-zinc-600 dark:text-zinc-400 truncate">Unanswered ({summary.unanswered})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50 inline-block flex-shrink-0" />
          <span className="text-zinc-600 dark:text-zinc-400 truncate">Marked ({summary.marked})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded border border-dashed border-zinc-400 dark:border-zinc-600 inline-block flex-shrink-0" />
          <span className="text-zinc-600 dark:text-zinc-400 truncate">Not Visited ({summary.notVisited})</span>
        </div>
      </div>

      {/* Question Number Grid */}
      <div className="flex-1 py-4 overflow-y-auto max-h-[360px] custom-scrollbar px-1">
        {filteredQuestions.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">
            No questions match filter "{activeFilter}"
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2.5 p-1">
            {filteredQuestions.map((q) => {
              const isCurrent = q.id === currentQuestionId;
              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(q.id)}
                  className={getStatusBadgeStyle(q.status, isCurrent)}
                  title={`Question ${q.questionNumber} - ${q.status.replace("_", " ")}`}
                >
                  <span className="flex items-center justify-center gap-0.5">
                    {q.questionNumber}
                    {q.status === "answered" && (
                      <CheckCircle2 className="w-2.5 h-2.5 text-white dark:text-zinc-900" />
                    )}
                  </span>
                  {q.status === "marked" && (
                    <Bookmark className="w-2.5 h-2.5 absolute top-1 right-1 fill-amber-500 text-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
