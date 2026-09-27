"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useExam } from "@/context/ExamContext";

export type AutosaveStatus = "IDLE" | "SAVING" | "SAVED" | "ERROR";

interface UseAutosaveOptions {
  intervalMs?: number;
  saveFn?: (examId: string, answers: Record<string, string>, markedForReview: string[]) => Promise<boolean>;
}

export function useAutosave(options: UseAutosaveOptions = {}) {
  const { intervalMs = 30000, saveFn } = options;
  const { activeExamId, answers, markedForReview, isSubmitted } = useExam();

  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>("IDLE");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveFnRef = useRef(saveFn);
  useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  // Flush current exam progress to localStorage fallback
  const saveToLocalStorage = useCallback((examId: string, currentAnswers: Record<string, string>, currentMarked: string[]) => {
    try {
      const backupKey = `ems_autosave_backup_${examId}`;
      const payload = {
        examId,
        answers: currentAnswers,
        markedForReview: currentMarked,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(backupKey, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to backup exam state to localStorage:", e);
    }
  }, []);

  // Perform autosave trigger
  const triggerAutosave = useCallback(async () => {
    if (!activeExamId || isSubmitted) return;

    setAutosaveStatus("SAVING");

    try {
      let isSuccess = true;
      if (saveFnRef.current) {
        isSuccess = await saveFnRef.current(activeExamId, answers, markedForReview);
      } else {
        // Mock remote API network request delay if no saveFn provided
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      if (isSuccess) {
        const now = new Date();
        saveToLocalStorage(activeExamId, answers, markedForReview);
        setLastSavedAt(now);
        setAutosaveStatus("SAVED");
      } else {
        // Fallback to local storage on API failure
        saveToLocalStorage(activeExamId, answers, markedForReview);
        setLastSavedAt(new Date());
        setAutosaveStatus("ERROR");
      }
    } catch (error) {
      console.error("Autosave request error, executing fallback:", error);
      saveToLocalStorage(activeExamId, answers, markedForReview);
      setLastSavedAt(new Date());
      setAutosaveStatus("ERROR");
    }
  }, [activeExamId, answers, markedForReview, isSubmitted, saveToLocalStorage]);

  // Interval-based trigger: Automatically run every 30s while exam is active
  useEffect(() => {
    if (!activeExamId || isSubmitted) {
      setAutosaveStatus("IDLE");
      return;
    }

    const timer = setInterval(() => {
      triggerAutosave();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeExamId, isSubmitted, intervalMs, triggerAutosave]);

  return {
    autosaveStatus,
    lastSavedAt,
    triggerAutosave,
  };
}
