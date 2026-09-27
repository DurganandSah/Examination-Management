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
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
      <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
        <RefreshCw className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
        <span className="hidden sm:inline">Role:</span>
      </div>
      {roles.map((item) => {
        const Icon = item.icon;
        const isActive = role === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setRole(item.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
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
