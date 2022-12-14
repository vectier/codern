import {
  Submission, QuestionSummary, Language,
  SubmissionStatus,
} from './entity';

export type GetSubmissionsByQuestionIdRequest = {
  userId?: string,
  questionId: number,
};

export type GetSubmissionsByQuestionIdResponse = {
  submissions: Submission[],
};

export type SaveCodeRequest = {
  userId: string,
  questionId: number,
  language: Language,
};

export type SubmitRequest = {
  userId: string,
  questionId: number,
  language: Language,
};

export type SubmitResponse = {
  submissionId: number,
  filePath: string,
};

export type GradeRequest = {
  submissionId: number,
};

export type GradeResponse = {
  id: number,
  questionId: number,
  language: Language,
  filePath: string,
  uploadedAt: number,
};

export type ResultRequest = {
  submissionId: number,
  status: SubmissionStatus,
  result: string,
};

export type GetQuestionSummaryByIdsRequest = {
  userId?: string,
  questionIds: number[],
};

export type GetQuestionSummaryByIdsResponse = {
  questionSummaries: QuestionSummary[],
};
