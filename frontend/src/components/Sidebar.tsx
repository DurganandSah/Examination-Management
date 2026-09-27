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

  const studentItems: NavItem[] = [
    { label: "Dashboard", href: "/", icon: BookOpen },
    { label: "Active Exams", href: "/student/exams", icon: CheckSquare, badge: "2" },
    { label: "Past Scores", href: "/student/scores", icon: Award },
  ];

  const facultyItems: NavItem[] = [
    { label: "Faculty Dashboard", href: "/faculty", icon: BarChart3 },
    { label: "Create Exam", href: "/faculty/exams/new", icon: PlusCircle },
    { label: "Question Bank", href: "/faculty/questions", icon: FileQuestion },
  ];

  const adminItems: NavItem[] = [
    { label: "Admin Console", href: "/admin", icon: Shield },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
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
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                EMS<span className="text-indigo-400">Portal</span>
              </span>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Role Indicator */}
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Active Context
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-indigo-300">
                {role} MODE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex flex-col gap-1 bg-slate-950/20">
          <div className="flex justify-between items-center text-[11px]">
            <span>EMS v1.0.0</span>
            <span className="text-emerald-400 font-mono text-[10px]">Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
