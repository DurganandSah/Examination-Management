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
  Filter,
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

  const filteredExams = mockActiveExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "ALL" || exam.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Student Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Examination Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Track active exams, view past grades, and jump straight into live assessments.
          </p>
        </div>
        <Link
          href="/student/exam/exam-01"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all self-start md:self-auto shrink-0"
        >
          <span>Launch Active Exam</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Exams
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">1</span>
            <span className="text-xs font-medium text-emerald-400">Live now</span>
          </div>
          <p className="text-[11px] text-slate-500">DSA Midterm ready to take</p>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed Exams
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">18</span>
            <span className="text-xs font-medium text-slate-400">Total</span>
          </div>
          <p className="text-[11px] text-slate-500">Across 6 semester courses</p>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">87.8%</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Grade Point Average: 3.8 / 4.0</p>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Time Spent
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">24.5h</span>
            <span className="text-xs font-medium text-slate-400">Total Test Time</span>
          </div>
          <p className="text-[11px] text-slate-500">Autosaved & verified state</p>
        </div>
      </div>

      {/* Active & Upcoming Exams Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Available Exams</h2>
            <p className="text-xs text-slate-400">Select an exam to begin or view schedule</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter exams..."
                className="w-full bg-slate-900 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setSelectedFilter("ALL")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === "ALL"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter("ACTIVE")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === "ACTIVE"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedFilter("UPCOMING")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedFilter === "UPCOMING"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
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
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      {exam.subject}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        LIVE NOW
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Instructor: {exam.facultyName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{exam.durationMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>{exam.totalQuestions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Starts: {exam.startTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {isActive ? (
                    <Link
                      href={`/student/exam/${exam.id}`}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Start Examination</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-800 text-slate-500 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Exam Results</h2>
            <p className="text-xs text-slate-400">Historical performance breakdown</p>
          </div>
          <Link
            href="/student/scores"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60">
              {mockRecentResults.map((result) => {
                const isPassed = result.status === "PASSED";
                return (
                  <tr key={result.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{result.examTitle}</td>
                    <td className="py-3.5 px-4 text-slate-400">{result.subject}</td>
                    <td className="py-3.5 px-4 text-slate-400">{result.date}</td>
                    <td className="py-3.5 px-4 font-mono">
                      {result.score} / {result.maxScore}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">{result.percentage}%</td>
                    <td className="py-3.5 px-4">
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> PASSED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
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
