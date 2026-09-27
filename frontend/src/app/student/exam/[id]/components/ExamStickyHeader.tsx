"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Send,
  X,
  FileCheck,
  User,
  ShieldCheck,
  HelpCircle,
  BookmarkCheck,
  AlertCircle
} from "lucide-react";

interface ExamStickyHeaderProps {
  examTitle?: string;
  studentName?: string;
  studentId?: string;
  initialTimeSeconds?: number;
  timeRemaining?: number;
  autosaveStatus?: "saved" | "saving" | "error" | "IDLE" | "SAVING" | "SAVED" | "ERROR";
  lastSavedText?: string;
  totalQuestions?: number;
  answeredCount?: number;
  unansweredCount?: number;
  markedCount?: number;
  onSubmitExam?: () => void;
}

export default function ExamStickyHeader({
  examTitle = "Advanced Mathematics & Physics Entrance Assessment 2026",
  studentName = "Alex Morgan",
  studentId = "STU-892401",
  initialTimeSeconds = 3600, // Default 60 minutes
  timeRemaining,
  autosaveStatus = "saved",
  lastSavedText = "10s ago",
  totalQuestions = 30,
  answeredCount = 18,
  unansweredCount = 10,
  markedCount = 2,
  onSubmitExam
}: ExamStickyHeaderProps) {
  const [timeLeft, setTimeLeft] = useState<number>(timeRemaining ?? initialTimeSeconds);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (timeRemaining !== undefined) {
      setTimeLeft(timeRemaining);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (timeRemaining !== undefined) return; // Controlled externally
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Dynamic countdown timer color styling based on remaining time
  const getTimerStyles = (seconds: number) => {
    if (seconds <= 300) {
      // Under 5 minutes -> Critical Warning with pulsing effect
      return {
        container: "bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse",
        icon: "text-rose-600 dark:text-rose-400 animate-spin-slow",
      };
    } else if (seconds <= 900) {
      // Under 15 minutes -> Warning state
      return {
        container: "bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300",
        icon: "text-amber-600 dark:text-amber-400",
      };
    }
    // Normal monochrome state
    return {
      container: "bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100",
      icon: "text-zinc-700 dark:text-zinc-300",
    };
  };

  const timerStyle = getTimerStyles(timeLeft);

  const handleFinalSubmit = () => {
    setIsSubmitModalOpen(false);
    if (onSubmitExam) {
      onSubmitExam();
    }
  };

  return (
    <>
      {/* Sticky Header Container */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm px-4 lg:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Exam Title & Student Badge */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-xs md:max-w-md lg:max-w-lg">
                {examTitle}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                  <User className="w-3 h-3 text-zinc-400" />
                  {studentName}
                </span>
                <span>•</span>
                <span className="font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded text-[11px] text-zinc-600 dark:text-zinc-400">
                  {studentId}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Autosave Status, Timer & Submit Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Autosave Status Badge */}
            <div className="hidden md:flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
              {autosaveStatus === "saving" || autosaveStatus === "SAVING" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 animate-spin" />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">Saving progress...</span>
                </>
              ) : autosaveStatus === "error" || autosaveStatus === "ERROR" ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Saved locally {lastSavedText ? `at ${lastSavedText}` : ""}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Saved locally <span className="text-zinc-900 dark:text-zinc-100 font-medium">{lastSavedText}</span>
                  </span>
                </>
              )}
            </div>

            {/* Sticky Countdown Timer Component */}
            <div
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all duration-300 shadow-inner ${timerStyle.container}`}
            >
              <Clock className={`w-4 h-4 ${timerStyle.icon}`} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Exam</span>
            </button>
          </div>
        </div>
      </header>

      {/* Confirmation & Summary Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-zinc-900 dark:text-zinc-100 relative overflow-hidden">
            {/* Top Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Submit Examination</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Review your exam summary before final submission.</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time Warning if low */}
            {timeLeft <= 300 && (
              <div className="mb-5 flex items-start space-x-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl p-3 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Time running low!</strong> You have less than 5 minutes remaining. Unsubmitted answers will automatically submit when time expires.
                </span>
              </div>
            )}

            {/* Answer Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-center">
                <div className="flex items-center justify-center space-x-1.5 text-zinc-900 dark:text-zinc-100 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-2xl font-bold">{answeredCount}</span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Answered</span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-center">
                <div className="flex items-center justify-center space-x-1.5 text-zinc-500 dark:text-zinc-400 mb-1">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-2xl font-bold">{unansweredCount}</span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Unanswered</span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-center">
                <div className="flex items-center justify-center space-x-1.5 text-zinc-700 dark:text-zinc-300 mb-1">
                  <BookmarkCheck className="w-4 h-4" />
                  <span className="text-2xl font-bold">{markedCount}</span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Marked</span>
              </div>
            </div>

            {/* Notice / Warning Box */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">⚠️ Important Warning:</p>
              Once submitted, you will not be able to change your answers or re-enter the test session. Total questions answered:{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">{answeredCount} of {totalQuestions}</strong>.
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Return to Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:scale-[1.01] active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Submission</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
