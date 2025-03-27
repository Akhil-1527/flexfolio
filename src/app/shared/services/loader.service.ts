import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  // Using signal for reactive loading state
  private loadingSignal = signal<boolean>(false);
  
  /**
   * Returns the current loading state
   */
  isLoading() {
    return this.loadingSignal();
  }
  
  /**
   * Shows the loader
   */
  show(): void {
    this.loadingSignal.set(true);
  }
  
  /**
   * Hides the loader
   */
  hide(): void {
    this.loadingSignal.set(false);
  }
}