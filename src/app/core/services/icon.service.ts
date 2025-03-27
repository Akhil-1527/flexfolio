import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Register any custom SVG icons here if needed
    // Example:
    // this.iconRegistry.addSvgIcon(
    //   'custom_icon',
    //   this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/custom-icon.svg')
    // );
  }

  // Initialize the service (called from app.component.ts)
  public initialize(): void {
    // Any initialization logic, if needed
  }
}