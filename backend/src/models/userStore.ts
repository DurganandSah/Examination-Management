import { hashPassword } from '../utils/password';
import { UserRole } from '../utils/jwt';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

class UserStore {
  private users: UserRecord[] = [];
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    if (this.isInitialized) return;
    const defaultHash = await hashPassword('Password123!');
    this.users = [
      {
        id: 'usr-student-1',
        name: 'Alex Johnson',
        email: 'student@ems.edu',
        passwordHash: defaultHash,
        role: 'STUDENT',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-faculty-1',
        name: 'Dr. Sarah Smith',
        email: 'faculty@ems.edu',
        passwordHash: defaultHash,
        role: 'FACULTY',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'usr-admin-1',
        name: 'System Administrator',
        email: 'admin@ems.edu',
        passwordHash: defaultHash,
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
      },
    ];
    this.isInitialized = true;
  }

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    await this.init();
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findById(id: string): Promise<UserRecord | undefined> {
    await this.init();
    return this.users.find((u) => u.id === id);
  }

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
  }): Promise<UserRecord> {
    await this.init();
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const userStore = new UserStore();
