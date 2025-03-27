/**
 * Authentication related models and interfaces
 */

// Login request payload
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // Registration request payload
  export interface RegisterRequest {
    fullName: string;
    email: string;
    username: string;
    password: string;
  }
  
  // Authentication response from API
  export interface AuthResponse {
    token: string;
    user: UserData;
  }
  
  // User data structure
  export interface UserData {
    id: number;
    fullName: string;
    email: string;
    username: string;
    avatarUrl?: string;
    publicUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Authentication error types
  export enum AuthErrorType {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    NETWORK_ERROR = 'NETWORK_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    EMAIL_EXISTS = 'EMAIL_EXISTS',
    USERNAME_EXISTS = 'USERNAME_EXISTS'
  }
  
  // Authentication error structure
  export interface AuthError {
    type: AuthErrorType;
    message: string;
    field?: string;
  }