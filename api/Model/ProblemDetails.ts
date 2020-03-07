interface IProblemDetail {
  title: string;
  detail: string;
  status: number;
  type: string;
  instance: string;
}

class ProblemDetails {
  problemDetail: IProblemDetail;

  constructor(problemDetail: IProblemDetail) {
    this.problemDetail = problemDetail;
  }
}

export { IProblemDetail, ProblemDetails };
