import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { 
  animate, 
  style, 
  transition, 
  trigger 
} from '@angular/animations';

import { AuthService } from '../../services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginRequest } from '../../models/auth.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginPageComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  private destroy$ = new Subject<void>();
  
  @ViewChild(LoginFormComponent) loginFormComponent?: LoginFormComponent;
  
  /**
   * Handles login form submission
   * @param credentials User login credentials
   */
  onLoginSubmit(credentials: LoginRequest): void {
    this.loaderService.show();
    
    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          // No need to show toast or navigate - the service handles it
        },
        error: (error) => {
          this.loaderService.hide();
          // No need to show toast - the service handles it
          if (this.loginFormComponent) {
            this.loginFormComponent.setError();
          }
        }
      });
  }
  
  /**
   * Navigates to registration page
   */
  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}