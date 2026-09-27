"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";

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

const mockPastScores: ScoreRecord[] = [
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
  {
    id: "res-04",
    examTitle: "Database Systems Midterm",
    subject: "CS 402",
    date: "Aug 15, 2026",
    score: 44,
    maxScore: 50,
    percentage: 88,
    status: "PASSED",
  },
  {
    id: "res-05",
    examTitle: "Operating Systems Fundamentals",
    subject: "CS 302",
    date: "Jul 30, 2026",
    score: 31,
    maxScore: 50,
    percentage: 62,
    status: "FAILED",
  },
];

export default function StudentPastScoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PASSED" | "FAILED">("ALL");

  const filteredScores = mockPastScores.filter((record) => {
    const matchesSearch =
      record.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-sm transition-all">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            Performance Archive
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Past Scores & Performance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            View historical attempt details, score breakdowns, and pass/fail statuses.
          </p>
        </div>

        <Link
          href="/student/dashboard"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold text-xs transition-all self-start md:self-auto shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        {/* Controls: Search & Status Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Recent Exam Results
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Showing {filteredScores.length} of {mockPastScores.length} total exam records
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === "ALL"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("PASSED")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === "PASSED"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setStatusFilter("FAILED")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  statusFilter === "FAILED"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
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
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 text-xs">
                    No score records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredScores.map((result) => {
                  const isPassed = result.status === "PASSED";
                  return (
                    <tr
                      key={result.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        {result.examTitle}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">
                        {result.subject}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">
                        {result.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {result.score} / {result.maxScore}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                        {result.percentage}%
                      </td>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
