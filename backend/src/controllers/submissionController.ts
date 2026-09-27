import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendSuccess } from '../utils';
import { AppError } from '../middleware/errorHandler';
import { examStore } from '../models/examStore';
import { questionStore } from '../models/questionStore';
import { attemptStore, AnswerItem } from '../models/attemptStore';

export const startExamAttempt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { examId } = req.body;
    const studentId = req.user?.userId;

    if (!examId) {
      return next(new AppError('Missing required field: examId', 400));
    }
    if (!studentId) {
      return next(new AppError('Unauthorized: Student user profile missing', 401));
    }

    const exam = await examStore.findById(examId);
    if (!exam) {
      return next(new AppError(`Exam with ID '${examId}' not found`, 404));
    }

    if (exam.status !== 'ACTIVE') {
      return next(new AppError('Exam is not currently active for test taking', 400));
    }

    const attempt = await attemptStore.createAttempt(examId, studentId);

    // Fetch questions linked to exam without exposing correctAnswer
    const allQuestions = await Promise.all(
      exam.questionIds.map((qId) => questionStore.findById(qId))
    );

    const safeQuestions = allQuestions
      .filter((q) => q !== undefined)
      .map((q) => {
        const { correctAnswer, ...rest } = q!;
        return rest;
      });

    return sendSuccess(
      res,
      {
        attemptId: attempt.id,
        examId: exam.id,
        examTitle: exam.title,
        durationMinutes: exam.durationMinutes,
        totalMarks: exam.totalMarks,
        startedAt: attempt.startedAt,
        questions: safeQuestions,
        savedAnswers: attempt.answers,
      },
      'Exam attempt started successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

export const autosaveProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { attemptId, answers } = req.body;
    const studentId = req.user?.userId;

    if (!attemptId || !answers || typeof answers !== 'object') {
      return next(
        new AppError('Missing required fields: attemptId and answers payload object', 400)
      );
    }
    if (!studentId) {
      return next(new AppError('Unauthorized: Student user profile missing', 401));
    }

    const updatedAttempt = await attemptStore.updateAnswers(
      attemptId,
      studentId,
      answers as Record<string, AnswerItem>
    );

    if (!updatedAttempt) {
      return next(
        new AppError('Active exam attempt not found or already submitted', 404)
      );
    }

    return sendSuccess(
      res,
      {
        attemptId: updatedAttempt.id,
        savedAt: updatedAttempt.updatedAt,
      },
      'Progress saved successfully'
    );
  } catch (err) {
    next(err);
  }
};

export const submitExam = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { attemptId, answers } = req.body;
    const studentId = req.user?.userId;

    if (!attemptId) {
      return next(new AppError('Missing required field: attemptId', 400));
    }
    if (!studentId) {
      return next(new AppError('Unauthorized: Student user profile missing', 401));
    }

    const existingAttempt = await attemptStore.findById(attemptId);
    if (!existingAttempt || existingAttempt.studentId !== studentId) {
      return next(new AppError('Exam attempt not found', 404));
    }

    if (existingAttempt.status !== 'IN_PROGRESS') {
      return next(new AppError('Exam attempt has already been submitted', 400));
    }

    const exam = await examStore.findById(existingAttempt.examId);
    if (!exam) {
      return next(new AppError('Associated exam not found', 404));
    }

    // Merge answers if final answers provided
    const finalAnswersMap: Record<string, AnswerItem> = {
      ...existingAttempt.answers,
      ...(answers || {}),
    };

    // Calculate score for MCQ questions
    let score = 0;
    const questionResults = await Promise.all(
      exam.questionIds.map(async (qId) => {
        const question = await questionStore.findById(qId);
        if (!question) return null;

        const studentAns = finalAnswersMap[qId];
        let isCorrect = false;

        if (question.type === 'MCQ' && studentAns?.selectedOption) {
          isCorrect =
            studentAns.selectedOption.trim().toLowerCase() ===
            question.correctAnswer.trim().toLowerCase();
          if (isCorrect) {
            score += question.marks;
          }
        }

        return {
          questionId: qId,
          type: question.type,
          marks: question.marks,
          earnedMarks: isCorrect ? question.marks : 0,
          isCorrect,
          correctAnswer: question.correctAnswer,
          userAnswer: studentAns?.selectedOption || studentAns?.answerText || null,
        };
      })
    );

    const submittedAttempt = await attemptStore.submitAttempt(
      attemptId,
      studentId,
      finalAnswersMap,
      score,
      exam.totalMarks
    );

    return sendSuccess(
      res,
      {
        attemptId: submittedAttempt?.id,
        status: submittedAttempt?.status,
        submittedAt: submittedAttempt?.submittedAt,
        score,
        totalMarks: exam.totalMarks,
        passingPercentage: exam.passingPercentage,
        isPassed: (score / exam.totalMarks) * 100 >= exam.passingPercentage,
        questionResults: questionResults.filter(Boolean),
      },
      'Exam submitted and evaluated successfully'
    );
  } catch (err) {
    next(err);
  }
};

export const getSubmissionResults = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const attemptId = Array.isArray(req.params.attemptId)
      ? req.params.attemptId[0]
      : req.params.attemptId;
    const user = req.user;

    if (!user) {
      return next(new AppError('Unauthorized: Authentication required', 401));
    }

    const attempt = await attemptStore.findById(attemptId);
    if (!attempt) {
      return next(new AppError(`Exam attempt '${attemptId}' not found`, 404));
    }

    // Students can only view their own attempt results
    if (user.role === 'STUDENT' && attempt.studentId !== user.userId) {
      return next(new AppError('Forbidden: Access to this submission result is denied', 403));
    }

    const exam = await examStore.findById(attempt.examId);

    return sendSuccess(
      res,
      {
        attempt,
        examTitle: exam?.title,
        subjectCode: exam?.subjectCode,
      },
      'Submission result retrieved successfully'
    );
  } catch (err) {
    next(err);
  }
};

// Aliases for backward compatibility
export const autosave = autosaveProgress;
