import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { NavigationHistoryService } from '../../core/services/navigation-history.service';

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.scss'],
  imports: [ButtonModule],
})
export class GoBackButtonComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly navigationHistory = inject(NavigationHistoryService);

  // Inputs
  label = input<string>('Back');
  icon = input<string>('pi pi-arrow-left');
  text = input<boolean>(true);
  severity = input<
    'secondary' | 'primary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  >('secondary');
  fallbackRoute = input<string>('/');

  onBackClick(): void {
    // Priority 1: Use the tracked previous root URL from the service
    const previousRoot = this.navigationHistory.getPreviousRootUrl();
    if (previousRoot) {
      this.router.navigateByUrl(previousRoot);
      return;
    }

    // Priority 2: Try using Location.back() to go to browser history
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    // Priority 3: Fallback to specific route
    this.router.navigateByUrl(this.fallbackRoute());
  }
}
