/**
 * Our custom error class that accepts an extra code argument to help properly
 * identify separate errors
 */
export class CustomError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
  }
}
