import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';
import {
  GetQuestionSummaryByIdRequest,
  GetQuestionSummaryByIdResponse,
  GetSubmissionsByQuestionIdRequest,
  GetSubmissionsByQuestionIdResponse,
  GradeRequest, GradeResponse, ResultRequest, Submission, SubmitRequest,
  SubmitResponse,
} from '@codern/internal';
import { GradingService } from '@/services/GradingService';

@Controller('/grade')
export class GradingController {

  private readonly gradingService: GradingService;

  public constructor(gradingService: GradingService) {
    this.gradingService = gradingService;
  }

  @GrpcMethod('GradingService')
  public async submit(data: SubmitRequest): Promise<SubmitResponse> {
    const { userId, questionId, language } = data;
    return this.gradingService.submit(userId, questionId, language);
  }

  @GrpcMethod('GradingService')
  public async grade(data: GradeRequest): Promise<GradeResponse> {
    return this.gradingService.grade(data.submissionId);
  }

  @EventPattern('result')
  public async result(data: ResultRequest): Promise<void> {
    this.gradingService.result(data.submissionId, data.result);
  }

  @GrpcMethod('GradingService')
  public async getQuestionSummaryByIds(
    data: GetQuestionSummaryByIdRequest,
  ): Promise<GetQuestionSummaryByIdResponse> {
    const { questionIds } = data;
    const questionSummaries = await this.gradingService.getQuestionSummaryByIds(questionIds);
    return { questionSummaries };
  }

  @GrpcMethod('GradingService')
  public async getSubmissionsByQuestionId(
    data: GetSubmissionsByQuestionIdRequest,
  ): Promise<GetSubmissionsByQuestionIdResponse> {
    const { userId, questionId } = data;
    const submissions = await this.gradingService.getSubmissionsByQuestionId(questionId, userId);
    return { submissions: submissions as Submission[] };
  }

}
