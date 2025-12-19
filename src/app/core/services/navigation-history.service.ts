import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Service to track navigation history and provide smart navigation
 * Specifically designed to remember the last "root" route (non-player route)
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationHistoryService {
  private readonly router = inject(Router);
  private previousRootUrl: string | null = null;
  private currentUrl: string = '';

  constructor() {
    // Track navigation events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEnd = event as NavigationEnd;
        const newUrl = navigationEnd.urlAfterRedirects || navigationEnd.url;

        // Before updating current, check if we should save it as previous root
        if (this.currentUrl && !this.currentUrl.startsWith('/player')) {
          this.previousRootUrl = this.currentUrl;
        }

        this.currentUrl = newUrl;
      });
  }

  /**
   * Get the last route URL
   */
  getPreviousRootUrl(): string | null {
    return this.previousRootUrl;
  }

  /**
   * Get the current URL
   */
  getCurrentUrl(): string {
    return this.currentUrl;
  }

  /**
   * Check if we have a previous root URL
   */
  hasPreviousRoot(): boolean {
    return this.previousRootUrl !== null;
  }
}
