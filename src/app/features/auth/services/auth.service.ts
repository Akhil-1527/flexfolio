import { Injectable, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  AuthError, 
  AuthErrorType, 
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserData
} from '../models/auth.model';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private isBrowser: boolean;
  
  // Base API URL for auth endpoints
  private apiUrl = `${environment.apiUrl}/api/auth`;
  
  // User state using signals
  private userSignal = signal<UserData | null>(null);
  user$ = this.userSignal.asReadonly();
  
  // Token state
  private tokenSignal = signal<string | null>(null);
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Load auth state from storage on service initialization (browser only)
    if (this.isBrowser) {
      this.loadAuthStateFromStorage();
    }
  }
  
  /**
   * Loads the authentication state from localStorage on app init
   */
  private loadAuthStateFromStorage(): void {
    if (!this.isBrowser) return;
    
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const userData = JSON.parse(userJson) as UserData;
        this.tokenSignal.set(token);
        this.userSignal.set(userData);
      } catch (error) {
        // Invalid stored user data, clear auth state
        this.clearAuthState();
      }
    }
  }
  
  /**
   * Authenticates user with email and password
   * @param credentials User login credentials
   * @returns Observable of auth response
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          // Handle success response
          this.toastService.show('Successfully logged in', 'success');
          // Redirect to dashboard after login
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          const errorMsg = this.getErrorMessage(error);
          this.toastService.show(errorMsg, 'error');
          return throwError(() => ({
            type: AuthErrorType.INVALID_CREDENTIALS,
            message: errorMsg
          } as AuthError));
        })
      );
  }
  
  /**
   * Registers a new user
   * @param userData User registration data
   * @returns Observable of auth response
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          // Handle success response
          this.toastService.show('Account created successfully', 'success');
          // Redirect to dashboard after registration
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          const errorMsg = this.getErrorMessage(error);
          this.toastService.show(errorMsg, 'error');
          return throwError(() => ({
            type: this.getErrorType(error, errorMsg),
            message: errorMsg,
            field: this.getErrorField(error, errorMsg)
          } as AuthError));
        })
      );
  }
  
  /**
   * Extract error message from HTTP error response
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    // Default message
    let message = 'An unexpected error occurred. Please try again.';
    
    // Try to extract message from response
    if (error.error) {
      if (typeof error.error === 'string') {
        message = error.error;
      } else if (error.error.message) {
        message = error.error.message;
      } else if (error.error.error) {
        message = error.error.error;
      } else if (error.message) {
        message = error.message;
      }
    }
    
    // Handle specific error cases
    if (error.status === 401) {
      message = 'Invalid email or password';
    } else if (error.status === 0) {
      message = 'Network error. Please check your connection and try again.';
    } else if (error.status === 409) {
      if (error.error && error.error.message && error.error.message.includes('email')) {
        message = 'This email is already registered';
      } else if (error.error && error.error.message && error.error.message.includes('username')) {
        message = 'This username is already taken';
      } else {
        message = 'This account already exists';
      }
    }
    
    return message;
  }
  
  /**
   * Get error type based on HTTP error
   */
  private getErrorType(error: HttpErrorResponse, errorMessage: string): AuthErrorType {
    if (error.status === 401) {
      return AuthErrorType.INVALID_CREDENTIALS;
    } else if (error.status === 400) {
      return AuthErrorType.VALIDATION_ERROR;
    } else if (error.status === 409) {
      if (errorMessage.toLowerCase().includes('email')) {
        return AuthErrorType.EMAIL_EXISTS;
      } else {
        return AuthErrorType.USERNAME_EXISTS;
      }
    } else if (error.status === 0) {
      return AuthErrorType.NETWORK_ERROR;
    }
    return AuthErrorType.SERVER_ERROR;
  }
  
  /**
   * Get field that has error
   */
  private getErrorField(error: HttpErrorResponse, errorMessage: string): string | undefined {
    if (error.status === 409) {
      if (errorMessage.toLowerCase().includes('email')) {
        return 'email';
      } else if (errorMessage.toLowerCase().includes('username')) {
        return 'username';
      }
    }
    return undefined;
  }
  
  /**
   * Logs out the current user
   */
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/auth/login']);
  }
  
  /**
   * Handles successful authentication
   * @param response Auth response from API
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Only store auth data in localStorage if in browser environment
    if (this.isBrowser) {
      // Store auth data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    // Update signals
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.user);
  }
  
  /**
   * Clears all authentication state
   */
  private clearAuthState(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }
  
  /**
   * Checks if user is currently authenticated
   * @returns boolean indicating authentication status
   */

  isAuthenticated(): boolean {
    return !!this.tokenSignal();
  }
  
  /**
   * Gets the current auth token
   * @returns Current JWT token or null
   */
  getToken(): string | null {
    return this.tokenSignal();
  }
}