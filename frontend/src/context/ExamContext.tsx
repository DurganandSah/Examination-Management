"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const STORAGE_KEY = "ems_active_exam_state";

export interface ExamState {
  activeExamId: string | null;
  timeRemaining: number; // in seconds
  answers: Record<string, string>; // questionId -> selectedOptionId (or comma-separated for multiple)
  markedForReview: string[]; // array of questionIds marked for review
  isSubmitted: boolean;
}

interface ExamContextType extends ExamState {
  startExam: (examId: string, durationMinutes: number) => void;
  selectAnswer: (questionId: string, optionId: string, isMultiple?: boolean) => void;
  clearAnswer: (questionId: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  submitExam: () => void;
  resetExam: () => void;
}

const defaultState: ExamState = {
  activeExamId: null,
  timeRemaining: 0,
  answers: {},
  markedForReview: [],
  isSubmitted: false,
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({ children }: { children: ReactNode }) {
  const [examState, setExamState] = useState<ExamState>(defaultState);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Hydrate state from localStorage on initial client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ExamState = JSON.parse(stored);
        if (parsed && !parsed.isSubmitted && parsed.activeExamId) {
          setExamState(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to hydrate exam state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage on state changes (if active & not submitted)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (examState.activeExamId && !examState.isSubmitted) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(examState));
      } else if (examState.isSubmitted) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to persist exam state to localStorage:", e);
    }
  }, [examState, isHydrated]);

  // Timer countdown interval
  useEffect(() => {
    if (!examState.activeExamId || examState.isSubmitted || examState.timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          localStorage.removeItem(STORAGE_KEY);
          return {
            ...prev,
            timeRemaining: 0,
            isSubmitted: true,
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.activeExamId, examState.isSubmitted, examState.timeRemaining]);

  const startExam = useCallback((examId: string, durationMinutes: number) => {
    // Check if matching state exists in localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ExamState = JSON.parse(stored);
        if (parsed && parsed.activeExamId === examId && !parsed.isSubmitted && parsed.timeRemaining > 0) {
          setExamState(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Failed checking existing stored exam state:", e);
    }

    const newState: ExamState = {
      activeExamId: examId,
      timeRemaining: durationMinutes * 60,
      answers: {},
      markedForReview: [],
      isSubmitted: false,
    };
    setExamState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error("Failed saving new exam state:", e);
    }
  }, []);

  const selectAnswer = useCallback((questionId: string, optionId: string, isMultiple: boolean = false) => {
    setExamState((prev) => {
      let updatedAnswer = optionId;
      if (isMultiple) {
        const existing = prev.answers[questionId] ? prev.answers[questionId].split(",") : [];
        const newArr = existing.includes(optionId)
          ? existing.filter((id) => id !== optionId)
          : [...existing, optionId];
        updatedAnswer = newArr.join(",");
      }

      const updatedAnswers = {
        ...prev.answers,
        [questionId]: updatedAnswer,
      };

      if (!updatedAnswer) {
        delete updatedAnswers[questionId];
      }

      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  }, []);

  const clearAnswer = useCallback((questionId: string) => {
    setExamState((prev) => {
      const copy = { ...prev.answers };
      delete copy[questionId];
      return {
        ...prev,
        answers: copy,
      };
    });
  }, []);

  const toggleMarkForReview = useCallback((questionId: string) => {
    setExamState((prev) => {
      const isMarked = prev.markedForReview.includes(questionId);
      const updatedMarked = isMarked
        ? prev.markedForReview.filter((id) => id !== questionId)
        : [...prev.markedForReview, questionId];
      return {
        ...prev,
        markedForReview: updatedMarked,
      };
    });
  }, []);

  const submitExam = useCallback(() => {
    setExamState((prev) => ({
      ...prev,
      isSubmitted: true,
    }));
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed removing exam state from localStorage upon submission:", e);
    }
  }, []);

  const resetExam = useCallback(() => {
    setExamState(defaultState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed resetting exam state:", e);
    }
  }, []);

  return (
    <ExamContext.Provider
      value={{
        ...examState,
        startExam,
        selectAnswer,
        clearAnswer,
        toggleMarkForReview,
        submitExam,
        resetExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
}
