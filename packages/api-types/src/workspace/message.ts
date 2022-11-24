export type GetAllWorkspacesRequest = {
  userId: string,
};

export type Workspace = {
  id: number,
  name: string,
  profilePath: string,
  ownerId: string,
  createdAt: number,
};

export type GetAllWorkspacesResponse = {
  workspaces: Workspace[],
};

export type GetWorkspaceByIdRequest = {
  workspaceId: number;
};

export type GetWorkspaceByIdResponse = {
  workspace: Workspace,
};

export type GetQuestionsByWorkspaceIdRequest = {
  id: number,
};

export enum QuestionLevel {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export type Question = {
  id: number,
  name: string,
  description: string,
  detailPath: string,
  level: string,
  workspaceId: number,
  createdAt: number,
};

export type GetQuestionsByWorkspaceIdResponse = {
  workspace: Workspace,
  questions: Question[],
};

export type GetQuestionByIdRequest = {
  id: number,
};

export type GetQuestionByIdResponse = {
  question: Question,
};
