import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { AuthService, RegisterRequest } from '../../services/auth.service';

// Assuming these services exist in the shared module
import { LoaderService } from '../../../../shared/services/loader.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    RegisterFormComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastService);
  
  onRegisterSubmit(userData: RegisterRequest): void {
    this.loaderService.show();
    this.authService.register(userData).subscribe({
      next: () => {
        this.loaderService.hide();
        this.toastService.show('Account created successfully!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loaderService.hide();
        this.toastService.show(
          error.error?.message || 'Failed to create account. Please try again.',
          'error'
        );
      }
    });
  }
  
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}