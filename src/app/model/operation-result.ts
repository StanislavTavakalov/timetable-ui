export interface OperationResult {
  readonly isCompleted: boolean;
  readonly errorMessage: string;
  readonly object: any;
}
