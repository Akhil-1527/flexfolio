import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Assuming these services exist in the shared module
import { LoaderService } from '../../../../shared/services/loader.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastService);
  
  onLoginSubmit(credentials: { email: string; password: string }): void {
    this.loaderService.show();
    this.authService.login(credentials).subscribe({
      next: () => {
        this.loaderService.hide();
        this.toastService.show('Successfully logged in', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loaderService.hide();
        this.toastService.show(
          error.error?.message || 'Failed to login. Please check your credentials.',
          'error'
        );
      }
    });
  }
  
  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}