"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  ArrowRight,
  Sparkles,
  Search,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface ExamCardData {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  startTime: string;
  status: "ACTIVE" | "UPCOMING";
  facultyName: string;
}

interface ScoreRecord {
  id: string;
  examTitle: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: "PASSED" | "FAILED";
}

const mockActiveExams: ExamCardData[] = [
  {
    id: "exam-01",
    title: "Data Structures & Algorithms Midterm",
    subject: "Computer Science 301",
    durationMinutes: 60,
    totalQuestions: 25,
    passingScore: 70,
    startTime: "Today, 02:00 PM",
    status: "ACTIVE",
    facultyName: "Dr. Sarah Vance",
  },
  {
    id: "exam-02",
    title: "Database Systems & SQL Optimization",
    subject: "Software Engineering 402",
    durationMinutes: 45,
    totalQuestions: 20,
    passingScore: 65,
    startTime: "Tomorrow, 10:00 AM",
    status: "UPCOMING",
    facultyName: "Prof. Alan Turing",
  },
  {
    id: "exam-03",
    title: "Full-Stack Web Development Fundamentals",
    subject: "Web Tech 204",
    durationMinutes: 90,
    totalQuestions: 40,
    passingScore: 75,
    startTime: "Oct 02, 2026",
    status: "UPCOMING",
    facultyName: "Dr. Sarah Vance",
  },
];

const mockRecentResults: ScoreRecord[] = [
  {
    id: "res-01",
    examTitle: "Object Oriented Programming Java",
    subject: "CS 201",
    date: "Sep 20, 2026",
    score: 46,
    maxScore: 50,
    percentage: 92,
    status: "PASSED",
  },
  {
    id: "res-02",
    examTitle: "Computer Networks & OSI Layer Quiz",
    subject: "CS 305",
    date: "Sep 14, 2026",
    score: 38,
    maxScore: 40,
    percentage: 95,
    status: "PASSED",
  },
  {
    id: "res-03",
    examTitle: "Discrete Mathematics Final",
    subject: "MATH 202",
    date: "Aug 28, 2026",
    score: 28,
    maxScore: 50,
    percentage: 56,
    status: "FAILED",
  },
];

export default function StudentDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING">("ALL");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "past-scores") {
        const el = document.getElementById("past-scores-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const filteredExams = mockActiveExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "ALL" || exam.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            Student Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Student Examination Portal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Track active exams, view past grades, and jump straight into live assessments.
          </p>
        </div>
        <Link
          href="/student/exam/exam-01"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all duration-200 self-start md:self-auto shrink-0 hover:scale-[1.02] active:scale-95"
        >
          <span>Launch Active Exam</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Active Exams
            </span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">1</span>
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
              <span className="relative flex h-2 w-2 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              Live now
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">DSA Midterm ready to take</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Completed Exams
            </span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">18</span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Across 6 semester courses</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">87.8%</span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3.2%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">GPA: 3.8 / 4.0</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Time Spent
            </span>
            <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">24.5h</span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Test Time</span>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Autosaved & verified state</p>
        </div>
      </div>

      {/* Active & Upcoming Exams Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Available Exams</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Select an exam to begin or view schedule</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter exams..."
                className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setSelectedFilter("ALL")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === "ALL"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter("ACTIVE")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === "ACTIVE"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedFilter("UPCOMING")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === "UPCOMING"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const isActive = exam.status === "ACTIVE";
            return (
              <div
                key={exam.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                      {exam.subject}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        <span className="relative flex h-2 w-2 mr-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Instructor: {exam.facultyName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{exam.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Starts: {exam.startTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {isActive ? (
                    <Link
                      href={`/student/exam/${exam.id}`}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                    >
                      <span>Start Examination</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 dark:text-zinc-500 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>Not Started Yet</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Exam Scores Table */}
      <div id="past-scores-section" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm scroll-mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Exam Results</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Historical performance breakdown</p>
          </div>
          <Link
            href="/student/scores"
            className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Exam Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Completion Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {mockRecentResults.map((result) => {
                const isPassed = result.status === "PASSED";
                return (
                  <tr key={result.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">{result.examTitle}</td>
                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">{result.subject}</td>
                    <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">{result.date}</td>
                    <td className="py-3.5 px-4 font-mono">
                      {result.score} / {result.maxScore}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">{result.percentage}%</td>
                    <td className="py-3.5 px-4">
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                          <AlertCircle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
