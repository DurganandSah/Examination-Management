"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "@/context/RoleContext";
import { RoleSwitcher } from "./RoleSwitcher";
import { Bell, Search, Menu, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user } = useRole();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search exams, courses, users..."
            className="w-full bg-zinc-100 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 text-sm pl-9 pr-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Light / Dark Mode Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-zinc-200" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        )}

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Notification Icon */}
        <button
          className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zinc-900 dark:bg-zinc-100 rounded-full ring-2 ring-white dark:ring-zinc-950" />
        </button>

        {/* User Profile Info */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 p-0.5 shadow-sm border border-zinc-300 dark:border-zinc-700">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-[6px] bg-zinc-100 dark:bg-zinc-900 object-cover"
              />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Profile Settings
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
