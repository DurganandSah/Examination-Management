export type QuestionType = 'MCQ' | 'SHORT';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface QuestionRecord {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  subject: string;
  difficulty: DifficultyLevel;
  marks: number;
  createdAt: string;
  updatedAt: string;
}

class QuestionStore {
  private questions: QuestionRecord[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    this.questions = [
      {
        id: 'q-101',
        text: 'What is the time complexity of binary search on a sorted array of size n?',
        type: 'MCQ',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
        subject: 'Data Structures & Algorithms',
        difficulty: 'EASY',
        marks: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q-102',
        text: 'Explain the ACID properties in relational database management systems.',
        type: 'SHORT',
        correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
        subject: 'Database Systems',
        difficulty: 'MEDIUM',
        marks: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async findAll(filters?: {
    subject?: string;
    difficulty?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ questions: QuestionRecord[]; total: number; page: number; limit: number }> {
    let result = [...this.questions];

    if (filters?.subject) {
      result = result.filter(
        (q) => q.subject.toLowerCase() === filters.subject!.toLowerCase()
      );
    }
    if (filters?.difficulty) {
      result = result.filter(
        (q) => q.difficulty.toUpperCase() === filters.difficulty!.toUpperCase()
      );
    }
    if (filters?.type) {
      result = result.filter(
        (q) => q.type.toUpperCase() === filters.type!.toUpperCase()
      );
    }

    const total = result.length;
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
    const startIndex = (page - 1) * limit;
    const paginatedQuestions = result.slice(startIndex, startIndex + limit);

    return {
      questions: paginatedQuestions,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<QuestionRecord | undefined> {
    return this.questions.find((q) => q.id === id);
  }

  async createQuestion(data: {
    text: string;
    type: QuestionType;
    options?: string[];
    correctAnswer: string;
    subject: string;
    difficulty: DifficultyLevel;
    marks: number;
  }): Promise<QuestionRecord> {
    const newQuestion: QuestionRecord = {
      id: `q-${Date.now()}`,
      text: data.text,
      type: data.type,
      options: data.options,
      correctAnswer: data.correctAnswer,
      subject: data.subject,
      difficulty: data.difficulty,
      marks: data.marks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  async updateQuestion(
    id: string,
    data: Partial<Omit<QuestionRecord, 'id' | 'createdAt'>>
  ): Promise<QuestionRecord | undefined> {
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) return undefined;

    const existing = this.questions[index];
    const updated: QuestionRecord = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.questions[index] = updated;
    return updated;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) return false;
    this.questions.splice(index, 1);
    return true;
  }
}

export const questionStore = new QuestionStore();
