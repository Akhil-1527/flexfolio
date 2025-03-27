import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Using signals for reactive state
  toasts = signal<Toast[]>([]);
  private nextId = 0;
  
  show(message: string, type: ToastType = 'info'): void {
    if (!message) {
      console.warn('Toast message is empty or undefined');
      return;
    }
    
    const id = this.nextId++;
    const toast: Toast = { id, message, type };
    
    // Add toast to the list
    this.toasts.update(toasts => [...toasts, toast]);
    
    // Default durations based on type
    const duration = type === 'success' ? 5000 : 
                     type === 'error' ? 7000 : 
                     5000; // Default for info and warning
    
    // Auto-remove after duration
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }
  
  remove(id: number): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }
  
  clear(): void {
    this.toasts.set([]);
  }
}