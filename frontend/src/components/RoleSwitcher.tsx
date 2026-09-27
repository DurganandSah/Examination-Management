"use client";

import React from "react";
import { useRole, Role } from "@/context/RoleContext";
import { ShieldCheck, UserCheck, GraduationCap, RefreshCw } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  const roles: { key: Role; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "STUDENT", label: "Student", icon: GraduationCap },
    { key: "FACULTY", label: "Faculty", icon: UserCheck },
    { key: "ADMIN", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-400">
        <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
        <span className="hidden sm:inline">Role Mock:</span>
      </div>
      {roles.map((item) => {
        const Icon = item.icon;
        const isActive = role === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setRole(item.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
