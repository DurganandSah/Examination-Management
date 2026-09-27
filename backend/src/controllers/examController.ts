import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils';
import { AppError } from '../middleware/errorHandler';
import { examStore, ExamStatus } from '../models/examStore';

export const createExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, subjectCode, durationMinutes, totalMarks, passingPercentage, status } = req.body;

    if (!title || !subjectCode || durationMinutes === undefined || totalMarks === undefined || passingPercentage === undefined) {
      return next(
        new AppError('Missing required fields: title, subjectCode, durationMinutes, totalMarks, passingPercentage', 400)
      );
    }

    if (status && !['UPCOMING', 'ACTIVE', 'COMPLETED'].includes(status)) {
      return next(new AppError('Invalid status. Must be UPCOMING, ACTIVE, or COMPLETED', 400));
    }

    const exam = await examStore.createExam({
      title,
      subjectCode,
      durationMinutes: Number(durationMinutes),
      totalMarks: Number(totalMarks),
      passingPercentage: Number(passingPercentage),
      status: status as ExamStatus | undefined,
    });

    return sendSuccess(res, exam, 'Exam created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getAllExams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;

    if (status && !['UPCOMING', 'ACTIVE', 'COMPLETED'].includes(status as string)) {
      return next(new AppError('Invalid status filter. Must be UPCOMING, ACTIVE, or COMPLETED', 400));
    }

    const exams = await examStore.findAll(status as ExamStatus | undefined);
    return sendSuccess(res, exams, 'Exams retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getExamById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const exam = await examStore.findById(id);

    if (!exam) {
      return next(new AppError(`Exam with ID '${id}' not found`, 404));
    }

    return sendSuccess(res, exam, 'Exam retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, subjectCode, durationMinutes, totalMarks, passingPercentage, status } = req.body;

    const existing = await examStore.findById(id);
    if (!existing) {
      return next(new AppError(`Exam with ID '${id}' not found`, 404));
    }

    if (status && !['UPCOMING', 'ACTIVE', 'COMPLETED'].includes(status)) {
      return next(new AppError('Invalid status. Must be UPCOMING, ACTIVE, or COMPLETED', 400));
    }

    const updatedExam = await examStore.updateExam(id, {
      ...(title && { title }),
      ...(subjectCode && { subjectCode }),
      ...(durationMinutes !== undefined && { durationMinutes: Number(durationMinutes) }),
      ...(totalMarks !== undefined && { totalMarks: Number(totalMarks) }),
      ...(passingPercentage !== undefined && { passingPercentage: Number(passingPercentage) }),
      ...(status && { status: status as ExamStatus }),
    });

    return sendSuccess(res, updatedExam, 'Exam updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await examStore.deleteExam(id);

    if (!deleted) {
      return next(new AppError(`Exam with ID '${id}' not found`, 404));
    }

    return sendSuccess(res, { id }, 'Exam deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const addQuestionsToExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { questionIds } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return next(new AppError('questionIds must be a non-empty array of question ID strings', 400));
    }

    const updatedExam = await examStore.addQuestionsToExam(id, questionIds);

    if (!updatedExam) {
      return next(new AppError(`Exam with ID '${id}' not found`, 404));
    }

    return sendSuccess(res, updatedExam, 'Questions added to exam successfully');
  } catch (err) {
    next(err);
  }
};

// Alias export for backward compatibility if imported elsewhere
export const getExams = getAllExams;
