"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Activity,
  Search,
  UserPlus,
  Edit2,
  UserX,
  UserCheck,
  Server,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Shield,
  Key,
  Mail,
  User as UserIcon,
} from "lucide-react";

type Role = "STUDENT" | "FACULTY" | "ADMIN";
type AccountStatus = "ACTIVE" | "SUSPENDED";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  dateJoined: string;
  status: AccountStatus;
}

const initialUsers: UserRecord[] = [
  {
    id: "usr-1",
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    role: "STUDENT",
    dateJoined: "2026-01-15",
    status: "ACTIVE",
  },
  {
    id: "usr-2",
    name: "Dr. Sarah Vance",
    email: "sarah.vance@university.edu",
    role: "FACULTY",
    dateJoined: "2025-08-20",
    status: "ACTIVE",
  },
  {
    id: "usr-3",
    name: "Jitesh Kumar",
    email: "admin.jitesh@university.edu",
    role: "ADMIN",
    dateJoined: "2025-01-01",
    status: "ACTIVE",
  },
  {
    id: "usr-4",
    name: "Prof. Alan Turing",
    email: "alan.turing@university.edu",
    role: "FACULTY",
    dateJoined: "2025-09-10",
    status: "ACTIVE",
  },
  {
    id: "usr-5",
    name: "Emily Watson",
    email: "emily.watson@university.edu",
    role: "STUDENT",
    dateJoined: "2026-02-01",
    status: "SUSPENDED",
  },
  {
    id: "usr-6",
    name: "David Chen",
    email: "david.chen@university.edu",
    role: "STUDENT",
    dateJoined: "2026-02-14",
    status: "ACTIVE",
  },
  {
    id: "usr-7",
    name: "Dr. Robert Ford",
    email: "robert.ford@university.edu",
    role: "FACULTY",
    dateJoined: "2025-11-05",
    status: "ACTIVE",
  },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<Role>("STUDENT");
  const [showRoleConfirm, setShowRoleConfirm] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role>("STUDENT");

  // System status refresh mock
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      dateJoined: new Date().toISOString().split("T")[0],
      status: "ACTIVE",
    };

    setUsers([newUser, ...users]);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("STUDENT");
    setIsAddUserOpen(false);
  };

  const handleToggleSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
            }
          : user
      )
    );
  };

  const handleOpenEditRole = (user: UserRecord) => {
    setEditingUser(user);
    setSelectedNewRole(user.role);
    setShowRoleConfirm(false);
  };

  const handleConfirmRoleChange = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? { ...u, role: selectedNewRole } : u
      )
    );
    setEditingUser(null);
    setShowRoleConfirm(false);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filtered Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats calculation
  const totalStudents = users.filter((u) => u.role === "STUDENT").length;
  const totalFaculty = users.filter((u) => u.role === "FACULTY").length;
  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-7 h-7 text-neutral-200" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                System Administration Workspace
              </h1>
            </div>
            <p className="text-neutral-400 text-sm md:text-base">
              Manage user roles, platform access, and system audit logs.
            </p>
          </div>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium text-sm rounded-lg transition-colors shadow-sm self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {/* Stat Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Registered Users */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-400">
                Total Registered Users
              </span>
              <Users className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">
                {users.length}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-neutral-200 inline-block" />
                  Students: <strong className="text-neutral-200">{totalStudents}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" />
                  Faculty: <strong className="text-neutral-200">{totalFaculty}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-neutral-600 inline-block" />
                  Admins: <strong className="text-neutral-200">{totalAdmins}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Active Exam Sessions */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-400">
                Active Exam Sessions
              </span>
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">14</div>
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
                <span>Concurrent Test-Takers: <strong className="text-neutral-200">342</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-medium">
                  Live Sync
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: System Health Status */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-400">
                System Health Status
              </span>
              <button
                onClick={triggerRefresh}
                title="Refresh Metrics"
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin text-white" : ""}`}
                />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-neutral-400" />
                  API Latency:
                </span>
                <span className="font-mono text-emerald-400 font-semibold">
                  24ms (Optimal)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-neutral-400" />
                  Redis Cache Status:
                </span>
                <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                  Database Pool:
                </span>
                <span className="font-mono text-neutral-200 font-semibold">
                  12 / 50 Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                User Management Directory
              </h2>
              <p className="text-xs text-neutral-400">
                Search, audit, edit roles, or toggle account access across the platform.
              </p>
            </div>

            {/* Controls: Search + Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600 transition-colors"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students Only</option>
                <option value="FACULTY">Faculty Only</option>
                <option value="ADMIN">Admins Only</option>
              </select>
            </div>
          </div>

          {/* User Data Table */}
          <div className="overflow-x-auto border border-neutral-800 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-neutral-500 text-sm"
                    >
                      No users match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300">
                          {user.name.charAt(0)}
                        </div>
                        <span>{user.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300 font-mono text-xs">
                        {user.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.role === "ADMIN" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-950">
                            <Shield className="w-3 h-3" /> ADMIN
                          </span>
                        )}
                        {user.role === "FACULTY" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-200 border border-neutral-700">
                            FACULTY
                          </span>
                        )}
                        {user.role === "STUDENT" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-950 text-neutral-400 border border-neutral-800">
                            STUDENT
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 text-xs">
                        {user.dateJoined}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {user.status === "ACTIVE" ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Suspended
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditRole(user)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded text-xs transition-colors"
                        >
                          <Edit2 className="w-3 h-3" /> Edit Role
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(user.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                            user.status === "ACTIVE"
                              ? "bg-rose-950/40 hover:bg-rose-900/60 border-rose-800/60 text-rose-300"
                              : "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-800/60 text-emerald-300"
                          }`}
                        >
                          {user.status === "ACTIVE" ? (
                            <>
                              <UserX className="w-3 h-3" /> Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3" /> Activate
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-neutral-300" /> Add New Platform User
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="jane.doe@university.edu"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Temporary Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Initial Role Assignment
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as Role)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-neutral-600"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="FACULTY">FACULTY</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium text-sm rounded-lg transition-colors"
                >
                  Create User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Management Modal Component */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-neutral-300" /> Manage User Role
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-1">
                <div className="text-xs text-neutral-400">Target User</div>
                <div className="font-semibold text-white">{editingUser.name}</div>
                <div className="text-xs text-neutral-500 font-mono">
                  {editingUser.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Select New Access Level / Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["STUDENT", "FACULTY", "ADMIN"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedNewRole(r);
                        setShowRoleConfirm(false);
                      }}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        selectedNewRole === r
                          ? "bg-neutral-100 text-neutral-950 border-neutral-100 shadow"
                          : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning/Confirmation Step */}
              {selectedNewRole !== editingUser.role && !showRoleConfirm && (
                selectedNewRole === "ADMIN" ? (
                  <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-200 text-xs flex items-start gap-2.5 shadow-sm">
                    <Shield className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-rose-300 mb-0.5">
                        CRITICAL SECURITY PRIVILEGE ELEVATION
                      </div>
                      <p className="text-neutral-300">
                        Granting <strong>ADMIN</strong> access will give <strong>{editingUser.name}</strong> full administrative rights, including user role overrides, audit logs access, and system-wide configuration controls.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Changing role from <strong>{editingUser.role}</strong> to{" "}
                      <strong>{selectedNewRole}</strong> will modify system permission capabilities immediately.
                    </span>
                  </div>
                )
              )}

              {showRoleConfirm && (
                <div className={`p-3 rounded-lg text-xs space-y-2 border ${
                  selectedNewRole === "ADMIN"
                    ? "bg-rose-950/80 border-rose-700 text-rose-100 shadow-md"
                    : "bg-amber-950/60 border-amber-700 text-amber-100"
                }`}>
                  <div className="font-semibold flex items-center gap-1.5 text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    {selectedNewRole === "ADMIN"
                      ? "CONFIRM ELEVATION TO SYSTEM ADMIN"
                      : "CONFIRM SECURITY ROLE CHANGE"}
                  </div>
                  <p className="text-neutral-200">
                    Are you sure you want to assign <strong>{selectedNewRole}</strong> privileges to {editingUser.name}?
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-800 pt-4">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
              {selectedNewRole === editingUser.role ? (
                <button
                  disabled
                  className="px-4 py-2 bg-neutral-800 text-neutral-500 font-medium text-sm rounded-lg cursor-not-allowed"
                >
                  No Change
                </button>
              ) : !showRoleConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowRoleConfirm(true)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium text-sm rounded-lg transition-colors"
                >
                  Apply Role Change
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmRoleChange}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  Confirm & Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
