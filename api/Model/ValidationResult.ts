import { IProblemDetail } from "./ProblemDetails";

class ValidationResult {
  isValid: Boolean;
  error: IProblemDetail = null;

  constructor(isValid: boolean, problemDetails: IProblemDetail) {
    this.isValid = isValid;

    if (!this.isValid) {
      this.error = problemDetails;
    }
  }
}

export { ValidationResult };
