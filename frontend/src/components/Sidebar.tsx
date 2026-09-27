"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";
import {
  GraduationCap,
  BookOpen,
  CheckSquare,
  Award,
  PlusCircle,
  FileQuestion,
  Users,
  Shield,
  Settings,
  BarChart3,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { role } = useRole();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCurrentTab(params.get("tab"));
    }
  }, [pathname]);

  const studentItems: NavItem[] = [
    { label: "Dashboard", href: "/student/dashboard", icon: BookOpen },
    { label: "Active Exams", href: "/student/exam/exam-01", icon: CheckSquare, badge: "1" },
    { label: "Past Scores", href: "/student/scores", icon: Award },
  ];

  const facultyItems: NavItem[] = [
    { label: "Faculty Dashboard", href: "/faculty/dashboard", icon: BarChart3 },
    { label: "Create Exam", href: "/faculty/dashboard?tab=creator", icon: PlusCircle },
    { label: "Question Bank", href: "/faculty/dashboard?tab=questions", icon: FileQuestion },
  ];

  const adminItems: NavItem[] = [
    { label: "Admin Console", href: "/admin/dashboard", icon: Shield },
    { label: "User Management", href: "/admin/dashboard?tab=users", icon: Users },
    { label: "System Settings", href: "/admin/dashboard?tab=settings", icon: Settings },
  ];

  const navMap: Record<Role, NavItem[]> = {
    STUDENT: studentItems,
    FACULTY: facultyItems,
    ADMIN: adminItems,
  };

  const currentNavItems = navMap[role];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-white dark:text-zinc-900" />
              </div>
              <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                EMS<span className="text-zinc-500 dark:text-zinc-400">Portal</span>
              </span>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Indicator */}
          <div className="mx-3 my-3 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-blue-50/80 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-blue-950/40 shadow-xs">
            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Active Context
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-wide">
                {role} MODE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white dark:text-zinc-900" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      isActive 
                        ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 border-transparent"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 flex flex-col gap-1 bg-zinc-50 dark:bg-zinc-900/20">
          <div className="flex justify-between items-center text-[11px]">
            <span>EMS v1.0.0</span>
            <span className="text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
