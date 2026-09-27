export type ExamStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';

export interface ExamRecord {
  id: string;
  title: string;
  subjectCode: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  status: ExamStatus;
  questionIds: string[];
  createdAt: string;
  updatedAt: string;
}

class ExamStore {
  private exams: ExamRecord[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.exams = [
      {
        id: 'exam-201',
        title: 'Data Structures & Algorithms Midterm Exam',
        subjectCode: 'CS201',
        durationMinutes: 90,
        totalMarks: 100,
        passingPercentage: 40,
        status: 'ACTIVE',
        questionIds: ['q-101'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'exam-202',
        title: 'Database Management Systems Quiz',
        subjectCode: 'CS302',
        durationMinutes: 45,
        totalMarks: 50,
        passingPercentage: 50,
        status: 'UPCOMING',
        questionIds: ['q-102'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async findAll(status?: ExamStatus): Promise<ExamRecord[]> {
    if (status) {
      return this.exams.filter((e) => e.status === status);
    }
    return [...this.exams];
  }

  async findById(id: string): Promise<ExamRecord | undefined> {
    return this.exams.find((e) => e.id === id);
  }

  async createExam(data: {
    title: string;
    subjectCode: string;
    durationMinutes: number;
    totalMarks: number;
    passingPercentage: number;
    status?: ExamStatus;
  }): Promise<ExamRecord> {
    const newExam: ExamRecord = {
      id: `exam-${Date.now()}`,
      title: data.title,
      subjectCode: data.subjectCode,
      durationMinutes: data.durationMinutes,
      totalMarks: data.totalMarks,
      passingPercentage: data.passingPercentage,
      status: data.status || 'UPCOMING',
      questionIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.exams.push(newExam);
    return newExam;
  }

  async updateExam(
    id: string,
    data: Partial<Omit<ExamRecord, 'id' | 'createdAt'>>
  ): Promise<ExamRecord | undefined> {
    const index = this.exams.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    const existing = this.exams[index];
    const updated: ExamRecord = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.exams[index] = updated;
    return updated;
  }

  async deleteExam(id: string): Promise<boolean> {
    const index = this.exams.findIndex((e) => e.id === id);
    if (index === -1) return false;
    this.exams.splice(index, 1);
    return true;
  }

  async addQuestionsToExam(id: string, questionIds: string[]): Promise<ExamRecord | undefined> {
    const exam = await this.findById(id);
    if (!exam) return undefined;

    // Merge existing and new questionIds, preserving uniqueness
    const updatedQuestionIds = Array.from(new Set([...exam.questionIds, ...questionIds]));
    return this.updateExam(id, { questionIds: updatedQuestionIds });
  }
}

export const examStore = new ExamStore();
