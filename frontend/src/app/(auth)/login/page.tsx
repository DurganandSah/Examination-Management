"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setRole(selectedRole);
        setSuccessMsg(`Logged in successfully as ${selectedRole}! Redirecting...`);
        setTimeout(() => {
          router.push("/student/dashboard");
        }, 1000);
      }, 800);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md mb-2">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Sign in to EMS
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Enter your credentials to access your examination dashboard
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl flex items-center gap-2 text-zinc-900 dark:text-zinc-100 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-zinc-900 dark:text-zinc-100" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Selection Mock */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Select Logged-In Role
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: "STUDENT" as Role, label: "Student", icon: GraduationCap },
            { key: "FACULTY" as Role, label: "Faculty", icon: UserCheck },
            { key: "ADMIN" as Role, label: "Admin", icon: ShieldCheck },
          ].map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelectedRole(r.key)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm"
                    : "bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@ems.edu"
              className={`w-full bg-zinc-50 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none ${
                errors.email
                  ? "border-rose-500/80 focus:ring-1 focus:ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <a href="#" className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-zinc-50 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-100 text-sm pl-10 pr-10 py-2.5 rounded-xl border transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none ${
                errors.password
                  ? "border-rose-500/80 focus:ring-1 focus:ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-95"
        >
          {isSubmitting ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-zinc-900 dark:text-zinc-100 font-semibold hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
