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
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { AuthError, AuthErrorType, RegisterRequest } from '../../models/auth.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    RegisterFormComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterPageComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  private destroy$ = new Subject<void>();
  
  @ViewChild(RegisterFormComponent) registerFormComponent?: RegisterFormComponent;
  
  /**
   * Handles register form submission
   * @param userData User registration data
   */
 
onRegisterSubmit(userData: RegisterRequest): void {
    this.loaderService.show();
    
    this.authService.register(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loaderService.hide();
          // No need to show toast or navigate - the service handles it
        },
        error: (error) => {
          this.loaderService.hide();
          // No need to show toast - the service handles it
          if (this.registerFormComponent) {
            this.registerFormComponent.setError(error.field);
          }
        }
      });
  }
  /**
   * Navigates to login page
   */
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}