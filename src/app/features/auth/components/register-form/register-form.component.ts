import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators 
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  @Output() formSubmit = new EventEmitter<RegisterRequest>();
  @Output() navigateToLogin = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  
  isLoading = false;
  hidePassword = true;
  
  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.formSubmit.emit(this.registerForm.value as RegisterRequest);
    } else {
      // Mark form controls as touched to trigger validation messages
      this.registerForm.markAllAsTouched();
    }
  }
  
  /**
   * Navigates to login page
   */
  onLoginClick(): void {
    this.navigateToLogin.emit();
  }
  
  /**
   * Resets loading state when error occurs
   */
  setError(field?: string): void {
    this.isLoading = false;
    
    // If a specific field has an error, focus it
    if (field && this.registerForm.get(field)) {
      this.registerForm.get(field)?.setErrors({ serverError: true });
    }
  }
  
  /**
   * Toggles password visibility
   */
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}