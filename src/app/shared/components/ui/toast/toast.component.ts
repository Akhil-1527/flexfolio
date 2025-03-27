import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{toast.type}}">
          <span class="toast-message">{{toast.message}}</span>
          <button class="close-button" (click)="toastService.remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 350px;
    }
    
    .toast {
      padding: 15px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      color: white;
      animation: slideIn 0.3s ease-out forwards;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .toast-success {
      background-color: #4caf50;
    }
    
    .toast-error {
      background-color: #f44336;
    }
    
    .toast-warning {
      background-color: #ff9800;
    }
    
    .toast-info {
      background-color: #2196f3;
    }
    
    .toast-message {
      flex: 1;
    }
    
    .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
      opacity: 0.7;
    }
    
    .close-button:hover {
      opacity: 1;
    }
    
    @media (max-width: 500px) {
      .toast-container {
        bottom: 0;
        right: 0;
        left: 0;
        padding: 10px;
        max-width: 100%;
      }
      
      .toast {
        width: 100%;
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}