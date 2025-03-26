export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    fullName: string;
    email: string;
    username: string;
    password: string;
  }
  
  export interface AuthToken {
    token: string;
    expiresAt: number;
  }
  
  export enum AuthErrorType {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    NETWORK_ERROR = 'NETWORK_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    EMAIL_EXISTS = 'EMAIL_EXISTS',
    USERNAME_EXISTS = 'USERNAME_EXISTS'
  }
  
  export interface AuthError {
    type: AuthErrorType;
    message: string;
    field?: string;
  }