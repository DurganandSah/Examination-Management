"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("STUDENT");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const errs: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      errs.fullName = "Full name is required";
    }

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

    if (confirmPassword !== password) {
      errs.confirmPassword = "Passwords do not match";
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
        setSuccessMsg(`Account created successfully as ${selectedRole}! Redirecting...`);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }, 800);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30 mb-2">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Create an Account
        </h1>
        <p className="text-xs text-slate-400">
          Join Examination Management System to access tests and grades
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Register As
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "STUDENT" as Role, label: "Student", desc: "Take exams & view results", icon: GraduationCap },
            { key: "FACULTY" as Role, label: "Faculty", desc: "Create & grade exams", icon: UserCheck },
          ].map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelectedRole(r.key)}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">{r.label}</span>
                </div>
                <span className="text-[10px] text-slate-400">{r.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Johnson"
              className={`w-full bg-slate-950/80 text-slate-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all placeholder:text-slate-600 focus:outline-none ${
                errors.fullName
                  ? "border-rose-500/80 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@ems.edu"
              className={`w-full bg-slate-950/80 text-slate-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all placeholder:text-slate-600 focus:outline-none ${
                errors.email
                  ? "border-rose-500/80 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-slate-950/80 text-slate-100 text-sm pl-10 pr-10 py-2.5 rounded-xl border transition-all placeholder:text-slate-600 focus:outline-none ${
                errors.password
                  ? "border-rose-500/80 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-slate-950/80 text-slate-100 text-sm pl-10 pr-4 py-2.5 rounded-xl border transition-all placeholder:text-slate-600 focus:outline-none ${
                errors.confirmPassword
                  ? "border-rose-500/80 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Creating account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
