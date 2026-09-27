import usersData from "./users.json";
import examsData from "./exams.json";
import questionsData from "./questions.json";
import attemptsData from "./attempts.json";

export type Role = "STUDENT" | "FACULTY" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export type ExamStatus = "UPCOMING" | "ACTIVE" | "COMPLETED";

export interface Exam {
  id: string;
  title: string;
  subjectCode: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  status: ExamStatus;
  questionsCount: number;
  scheduledAt: string;
}

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Question {
  id: string;
  examId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  subjectTag: string;
  difficulty: QuestionDifficulty;
  marks: number;
}

export type AttemptStatus = "PASSED" | "FAILED";

export interface Attempt {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  subjectCode: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: AttemptStatus;
  completedAt: string;
}

export function getMockUsers(): User[] {
  return usersData as User[];
}

export function getMockExams(): Exam[] {
  return examsData as Exam[];
}

export function getMockQuestions(examId?: string): Question[] {
  const questions = questionsData as Question[];
  if (examId) {
    return questions.filter((q) => q.examId === examId);
  }
  return questions;
}

export function getMockUserAttempts(userId: string): Attempt[] {
  const attempts = attemptsData as Attempt[];
  return attempts.filter((att) => att.userId === userId);
}
