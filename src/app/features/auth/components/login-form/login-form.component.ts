import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators,
  FormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Output() formSubmit = new EventEmitter<LoginRequest>();
  @Output() navigateToRegister = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  
  isLoading = false;
  hidePassword = true;
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.formSubmit.emit(this.loginForm.value as LoginRequest);
    } else {
      // Mark form controls as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
    }
  }
  
  /**
   * Navigates to registration page
   */
  onRegisterClick(): void {
    this.navigateToRegister.emit();
  }
  
  /**
   * Resets loading state when error occurs
   */
  setError(): void {
    this.isLoading = false;
  }
  
  /**
   * Toggles password visibility
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}