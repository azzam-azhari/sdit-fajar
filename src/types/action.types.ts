export type ActionSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ActionError = {
  success: false;
  error: string;
  title?: string;
  hint?: string;
  fieldErrors?: Record<string, string[]>;
  code?:
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'VALIDATION_ERROR'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'ROLE_MISMATCH'
    | 'WRONG_PASSWORD'
    | 'ACCOUNT_INACTIVE';
};

export type ActionResult<T> = ActionSuccess<T> | ActionError;
