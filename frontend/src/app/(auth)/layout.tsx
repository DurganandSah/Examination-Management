import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Examination Management System",
  description: "Sign in or create an account for EMS",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors">
      {/* Dynamic background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-400/5 dark:bg-zinc-100/5 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}
