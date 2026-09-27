export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';

export interface AnswerItem {
  questionId: string;
  selectedOption?: string;
  answerText?: string;
}

export interface AttemptRecord {
  id: string;
  examId: string;
  studentId: string;
  status: AttemptStatus;
  answers: Record<string, AnswerItem>; // questionId -> AnswerItem
  score?: number;
  totalMarks?: number;
  startedAt: string;
  submittedAt?: string;
  updatedAt: string;
}

class AttemptStore {
  private attempts: AttemptRecord[] = [];

  async createAttempt(examId: string, studentId: string): Promise<AttemptRecord> {
    // Check if an existing attempt is in progress
    const existing = this.attempts.find(
      (a) => a.examId === examId && a.studentId === studentId && a.status === 'IN_PROGRESS'
    );
    if (existing) {
      return existing;
    }

    const newAttempt: AttemptRecord = {
      id: `att-${Date.now()}`,
      examId,
      studentId,
      status: 'IN_PROGRESS',
      answers: {},
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.attempts.push(newAttempt);
    return newAttempt;
  }

  async findById(id: string): Promise<AttemptRecord | undefined> {
    return this.attempts.find((a) => a.id === id);
  }

  async findByExamAndStudent(examId: string, studentId: string): Promise<AttemptRecord | undefined> {
    return this.attempts.find((a) => a.examId === examId && a.studentId === studentId);
  }

  async updateAnswers(
    attemptId: string,
    studentId: string,
    answers: Record<string, AnswerItem>
  ): Promise<AttemptRecord | undefined> {
    const attempt = this.attempts.find((a) => a.id === attemptId && a.studentId === studentId);
    if (!attempt || attempt.status !== 'IN_PROGRESS') return undefined;

    attempt.answers = {
      ...attempt.answers,
      ...answers,
    };
    attempt.updatedAt = new Date().toISOString();
    return attempt;
  }

  async submitAttempt(
    attemptId: string,
    studentId: string,
    finalAnswers?: Record<string, AnswerItem>,
    score?: number,
    totalMarks?: number
  ): Promise<AttemptRecord | undefined> {
    const attempt = this.attempts.find((a) => a.id === attemptId && a.studentId === studentId);
    if (!attempt || attempt.status !== 'IN_PROGRESS') return undefined;

    if (finalAnswers) {
      attempt.answers = {
        ...attempt.answers,
        ...finalAnswers,
      };
    }

    attempt.status = 'SUBMITTED';
    attempt.submittedAt = new Date().toISOString();
    attempt.updatedAt = new Date().toISOString();
    attempt.score = score;
    attempt.totalMarks = totalMarks;

    return attempt;
  }
}

export const attemptStore = new AttemptStore();
