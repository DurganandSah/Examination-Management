import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils';
import { AppError } from '../middleware/errorHandler';
import { questionStore, QuestionType, DifficultyLevel } from '../models/questionStore';

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, type, options, correctAnswer, subject, difficulty, marks } = req.body;

    if (!text || !type || !correctAnswer || !subject || !difficulty || marks === undefined) {
      return next(
        new AppError('Missing required fields: text, type, correctAnswer, subject, difficulty, marks', 400)
      );
    }

    if (!['MCQ', 'SHORT'].includes(type)) {
      return next(new AppError('Invalid question type. Must be MCQ or SHORT', 400));
    }

    if (!['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      return next(new AppError('Invalid difficulty level. Must be EASY, MEDIUM, or HARD', 400));
    }

    if (type === 'MCQ' && (!Array.isArray(options) || options.length < 2)) {
      return next(new AppError('MCQ questions require an options array with at least 2 items', 400));
    }

    const question = await questionStore.createQuestion({
      text,
      type: type as QuestionType,
      options,
      correctAnswer,
      subject,
      difficulty: difficulty as DifficultyLevel,
      marks: Number(marks),
    });

    return sendSuccess(res, question, 'Question created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, difficulty, type, page, limit } = req.query;

    const result = await questionStore.findAll({
      subject: typeof subject === 'string' ? subject : undefined,
      difficulty: typeof difficulty === 'string' ? difficulty : undefined,
      type: typeof type === 'string' ? type : undefined,
      page: typeof page === 'string' ? parseInt(page, 10) : undefined,
      limit: typeof limit === 'string' ? parseInt(limit, 10) : undefined,
    });

    return sendSuccess(res, result, 'Questions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const question = await questionStore.findById(id);

    if (!question) {
      return next(new AppError(`Question with ID '${id}' not found`, 404));
    }

    return sendSuccess(res, question, 'Question retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { text, type, options, correctAnswer, subject, difficulty, marks } = req.body;

    const existing = await questionStore.findById(id);
    if (!existing) {
      return next(new AppError(`Question with ID '${id}' not found`, 404));
    }

    if (type && !['MCQ', 'SHORT'].includes(type)) {
      return next(new AppError('Invalid question type. Must be MCQ or SHORT', 400));
    }

    if (difficulty && !['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
      return next(new AppError('Invalid difficulty level. Must be EASY, MEDIUM, or HARD', 400));
    }

    const updatedQuestion = await questionStore.updateQuestion(id, {
      ...(text && { text }),
      ...(type && { type: type as QuestionType }),
      ...(options && { options }),
      ...(correctAnswer && { correctAnswer }),
      ...(subject && { subject }),
      ...(difficulty && { difficulty: difficulty as DifficultyLevel }),
      ...(marks !== undefined && { marks: Number(marks) }),
    });

    return sendSuccess(res, updatedQuestion, 'Question updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await questionStore.deleteQuestion(id);

    if (!deleted) {
      return next(new AppError(`Question with ID '${id}' not found`, 404));
    }

    return sendSuccess(res, { id }, 'Question deleted successfully');
  } catch (err) {
    next(err);
  }
};
