"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileQuestion,
  BookOpen,
  Users,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  SlidersHorizontal,
  Clock,
  Award,
  Layers,
  Sparkles,
  HelpCircle,
  PlusCircle,
} from "lucide-react";

interface QuestionItem {
  id: string;
  questionText: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "MCQ" | "Short Answer";
  points: number;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface ExamTemplate {
  id: string;
  title: string;
  subjectCode: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  shuffleQuestions: boolean;
  randomizeOptions: boolean;
  instantResults: boolean;
  tabSwitchDetection: boolean;
  selectedQuestionIds: string[];
}

const initialQuestions: QuestionItem[] = [
  {
    id: "q-101",
    questionText: "What is the derivative of f(x) = x^3 + 3x^2 - 5x + 7 with respect to x?",
    subject: "Mathematics",
    difficulty: "Medium",
    type: "MCQ",
    points: 4,
    options: [
      { id: "A", text: "3x^2 + 6x - 5" },
      { id: "B", text: "3x^2 + 3x - 5" },
      { id: "C", text: "x^2 + 6x - 5" },
      { id: "D", text: "3x^2 + 6x + 7" },
    ],
    correctAnswer: "A",
  },
  {
    id: "q-102",
    questionText: "Which of the following matrices are invertible?",
    subject: "Mathematics",
    difficulty: "Hard",
    type: "MCQ",
    points: 4,
    options: [
      { id: "A", text: "Identity matrix I_n" },
      { id: "B", text: "Matrix with determinant 0" },
      { id: "C", text: "Diagonal matrix with non-zero diagonal" },
      { id: "D", text: "Zero matrix O_n" },
    ],
    correctAnswer: "A",
  },
  {
    id: "q-103",
    questionText: "According to Kepler's second law, areal velocity of a planet is constant due to conservation of:",
    subject: "Physics",
    difficulty: "Easy",
    type: "MCQ",
    points: 4,
    options: [
      { id: "A", text: "Linear Momentum" },
      { id: "B", text: "Angular Momentum" },
      { id: "C", text: "Energy" },
      { id: "D", text: "Mass" },
    ],
    correctAnswer: "B",
  },
  {
    id: "q-104",
    questionText: "Explain the concept of time complexity and Big O notation for search algorithms.",
    subject: "Computer Science",
    difficulty: "Medium",
    type: "Short Answer",
    points: 5,
    options: [],
    correctAnswer: "Open ended evaluation",
  },
  {
    id: "q-105",
    questionText: "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written?",
    subject: "Logic",
    difficulty: "Medium",
    type: "MCQ",
    points: 4,
    options: [
      { id: "A", text: "EOJDJEFM" },
      { id: "B", text: "EOJDEJFM" },
      { id: "C", text: "MFEJDJOE" },
      { id: "D", text: "MFEJDJEO" },
    ],
    correctAnswer: "A",
  },
];

const initialExams: ExamTemplate[] = [
  {
    id: "exam-01",
    title: "Advanced Mathematics & Physics Entrance 2026",
    subjectCode: "MATH-301",
    description: "End-of-term comprehensive evaluation covering differential calculus and orbital mechanics.",
    durationMinutes: 60,
    totalMarks: 100,
    passingPercentage: 60,
    shuffleQuestions: true,
    randomizeOptions: true,
    instantResults: false,
    tabSwitchDetection: true,
    selectedQuestionIds: ["q-101", "q-102", "q-103"],
  },
];

function FacultyDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"questions" | "creator">("questions");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "creator") {
      setActiveTab("creator");
    } else if (tabParam === "questions") {
      setActiveTab("questions");
    }
  }, [searchParams]);

  // Question Bank State
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Add Question Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newDifficulty, setNewDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [newType, setNewType] = useState<"MCQ" | "Short Answer">("MCQ");
  const [newPoints, setNewPoints] = useState(4);
  const [newOptions, setNewOptions] = useState([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ]);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("A");

  // Exam Creator Engine State
  const [exams, setExams] = useState<ExamTemplate[]>(initialExams);
  const [examTitle, setExamTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingPercentage, setPassingPercentage] = useState(60);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);
  const [instantResults, setInstantResults] = useState(false);
  const [tabSwitchDetection, setTabSwitchDetection] = useState(true);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(["q-101", "q-103"]);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "All" || q.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    const matchesType = selectedType === "All" || q.type === selectedType;
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setSelectedQuestionIds((prev) => prev.filter((qId) => qId !== id));
    showNotification("Question removed from bank.");
  };

  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const created: QuestionItem = {
      id: `q-${Date.now()}`,
      questionText: newQuestionText,
      subject: newSubject,
      difficulty: newDifficulty,
      type: newType,
      points: newPoints,
      options: newType === "MCQ" ? newOptions : [],
      correctAnswer: newType === "MCQ" ? newCorrectAnswer : "N/A",
    };

    setQuestions((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewQuestionText("");
    setNewOptions([
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
    ]);
    showNotification("New question successfully added to bank!");
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !subjectCode.trim()) return;

    const newExam: ExamTemplate = {
      id: `exam-${Date.now()}`,
      title: examTitle,
      subjectCode,
      description: examDescription,
      durationMinutes,
      totalMarks,
      passingPercentage,
      shuffleQuestions,
      randomizeOptions,
      instantResults,
      tabSwitchDetection,
      selectedQuestionIds,
    };

    setExams((prev) => [newExam, ...prev]);
    showNotification("Assessment created & published successfully!");
    // Reset form
    setExamTitle("");
    setSubjectCode("");
    setExamDescription("");
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
      case "Medium":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700";
      case "Hard":
        return "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto transition-colors">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold uppercase tracking-wider">
                  Faculty Workspace
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Faculty Management Workspace
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Manage question banks, build assessments, and review results.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-sm transition-all duration-200 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="p-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-between shadow-lg border border-zinc-700 dark:border-zinc-300">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>{notification}</span>
              </div>
            </div>
          )}

          {/* Analytics Overview Cards (4 Required Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Total Questions in Bank
                </p>
                <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                  {questions.length}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Across {Array.from(new Set(questions.map((q) => q.subject))).length} subjects</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <FileQuestion className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Active Exams
                </p>
                <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                  {exams.length}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Scheduled for students</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Total Students Evaluated
                </p>
                <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                  342
                </h3>
                <p className="text-xs text-zinc-500 mt-1">+18 this week</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Average Class Pass Rate
                </p>
                <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                  84.2%
                </h3>
                <p className="text-xs text-zinc-500 mt-1">Consistent baseline</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                <Award className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 space-x-6">
            <button
              onClick={() => setActiveTab("questions")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "questions"
                  ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              Question Bank Repository
            </button>
            <button
              onClick={() => setActiveTab("creator")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "creator"
                  ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                  : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              Exam Creator Engine
            </button>
          </div>

          {/* TAB 1: QUESTION BANK MANAGEMENT VIEW */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search question text or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold uppercase">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filters:</span>
                  </div>

                  {/* Subject Filter */}
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Logic">Logic</option>
                  </select>

                  {/* Difficulty Filter */}
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  {/* Question Type Filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="All">All Types</option>
                    <option value="MCQ">MCQ</option>
                    <option value="Short Answer">Short Answer</option>
                  </select>
                </div>
              </div>

              {/* Question List Table */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 uppercase font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Question Details</th>
                        <th className="py-3.5 px-4">Subject</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Difficulty</th>
                        <th className="py-3.5 px-4">Marks</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-zinc-400 text-xs">
                            No questions match the current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredQuestions.map((q) => (
                          <tr key={q.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                            <td className="py-4 px-4 max-w-md">
                              <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
                                {q.questionText}
                              </p>
                              {q.type === "MCQ" && (
                                <p className="text-xs text-zinc-400 mt-1">
                                  Correct Answer: Option {q.correctAnswer}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 font-medium text-zinc-700 dark:text-zinc-300">
                              {q.subject}
                            </td>
                            <td className="py-4 px-4 text-xs font-semibold">
                              <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200">
                                {q.type}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${getDifficultyBadge(q.difficulty)}`}>
                                {q.difficulty}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                              +{q.points}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => showNotification(`Editing feature for ${q.id} ready in API phase.`)}
                                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                                  title="Edit Question"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                  title="Delete Question"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXAM CREATOR ENGINE VIEW */}
          {activeTab === "creator" && (
            <div className="space-y-6">
              <form onSubmit={handleCreateExamSubmit} className="space-y-6">
                {/* Form Section 1: Basic Information */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-500" />
                    Basic Exam Parameters
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                        Exam Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Midterm Physics Evaluation"
                        value={examTitle}
                        onChange={(e) => setExamTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                        Subject Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PHY-201"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Exam Description & Guidelines
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief guidelines, instructions, or scope for students..."
                      value={examDescription}
                      onChange={(e) => setExamDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    />
                  </div>
                </div>

                {/* Form Section 2: Timing & Scoring Rules */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-500" />
                    Timing & Grading Rules
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={360}
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                        Total Marks
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={500}
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                        Passing Percentage (%)
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={100}
                        value={passingPercentage}
                        onChange={(e) => setPassingPercentage(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Section 3: Exam Execution Toggles */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                    Proctoring & Execution Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Shuffle Questions
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={randomizeOptions}
                        onChange={(e) => setRandomizeOptions(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Randomize Options
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={instantResults}
                        onChange={(e) => setInstantResults(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Instant Results
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tabSwitchDetection}
                        onChange={(e) => setTabSwitchDetection(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                      />
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Tab Switch Detection
                      </span>
                    </label>
                  </div>
                </div>

                {/* Form Section 4: Question Picker */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-zinc-500" />
                      Select Questions from Question Bank
                    </h3>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                      {selectedQuestionIds.length} Selected
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {questions.map((q) => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => toggleQuestionSelection(q.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-zinc-100 dark:bg-zinc-800/80 border-zinc-900 dark:border-zinc-100"
                              : "bg-zinc-50/40 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100/50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                            />
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {q.questionText}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-0.5">
                                <span>{q.subject}</span>
                                <span>•</span>
                                <span>{q.type}</span>
                                <span>•</span>
                                <span>+{q.points} Marks</span>
                              </div>
                            </div>
                          </div>

                          <span className={`text-xs px-2 py-0.5 rounded font-semibold border ${getDifficultyBadge(q.difficulty)}`}>
                            {q.difficulty}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-sm transition-all duration-200 shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create & Publish Exam</span>
                  </button>
                </div>
              </form>
            </div>
          )}

      {/* Add New Question Modal Drawer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add New Question</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Question Text
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the full question statement..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Logic">Logic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Short Answer">Short Answer</option>
                  </select>
                </div>
              </div>

              {newType === "MCQ" && (
                <div className="space-y-2.5 pt-2">
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Options A through D
                  </label>
                  {newOptions.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-6 font-bold text-xs text-zinc-400">{opt.id}.</span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${opt.id} content...`}
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewOptions((prev) =>
                            prev.map((o, i) => (i === idx ? { ...o, text: val } : o))
                          );
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      Correct Option
                    </label>
                    <select
                      value={newCorrectAnswer}
                      onChange={(e) => setNewCorrectAnswer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:outline-none"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-colors"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FacultyDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading Faculty Workspace...</div>}>
      <FacultyDashboardContent />
    </Suspense>
  );
}
