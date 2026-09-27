"use client";

import React, { useState } from "react";
import { useRole } from "@/context/RoleContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { Bell, Search, Menu, Sparkles, ChevronDown } from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useRole();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search exams, courses, users..."
            className="w-full bg-slate-950/60 text-slate-200 text-sm pl-9 pr-4 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Notification Icon */}
        <button
          className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
        </button>

        {/* User Profile Info */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 shadow-sm">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-[7px] bg-slate-900 object-cover"
              />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Profile Settings
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-800/80 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
