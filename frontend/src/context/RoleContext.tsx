"use client";

import React, { createContext, useContext, useState } from "react";

export type Role = "STUDENT" | "FACULTY" | "ADMIN";

interface User {
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
}

const defaultUsers: Record<Role, User> = {
  STUDENT: {
    name: "Alex Johnson",
    email: "alex.j@ems.edu",
    role: "STUDENT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  FACULTY: {
    name: "Dr. Sarah Vance",
    email: "sarah.vance@ems.edu",
    role: "FACULTY",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  ADMIN: {
    name: "Marcus Brody",
    email: "admin.brody@ems.edu",
    role: "ADMIN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("STUDENT");

  return (
    <RoleContext.Provider value={{ role, setRole, user: defaultUsers[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
