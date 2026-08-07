import { Injectable, signal, computed, InjectionToken, inject } from '@angular/core';
import { ServerId, SERVER_STORAGE_KEY, DEFAULT_SERVER } from '@core/constants';
import { environment } from '@env';

export const SEASONAL_ENABLED = new InjectionToken<boolean>('SEASONAL_ENABLED', {
  providedIn: 'root',
  factory: () => environment.seasonal.enabled,
});

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly seasonalEnabled =
    inject(SEASONAL_ENABLED, { optional: true }) ?? environment.seasonal.enabled;
  readonly seasonalAvailable: boolean = this.seasonalEnabled;
  private readonly _server = signal<ServerId>(this.getInitialServer());
  readonly server = this._server.asReadonly();
  readonly responsePlayerLimit = computed(() => environment[this._server()].responsePlayerLimit);

  setServer(server: ServerId): void {
    if (server === 'seasonal' && !this.seasonalAvailable) return;
    if (this._server() !== server) {
      this._server.set(server);
      this.persist();
    }
  }

  toggleServer(): void {
    if (!this.seasonalAvailable) return;
    this.setServer(this._server() === 'classic' ? 'seasonal' : 'classic');
  }

  /**
   * Reads a `server` value from a URL query parameter and applies it.
   * Returns `true` if a valid server was found and applied, `false` otherwise.
   */
  applyServerFromQueryParam(raw: string | null): void {
    if (raw === 'classic' || (raw === 'seasonal' && this.seasonalAvailable)) {
      this.setServer(raw);
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(SERVER_STORAGE_KEY, this._server());
    } catch {
      /* localStorage may be unavailable in private browsing or SSR */
    }
  }

  private getInitialServer(): ServerId {
    try {
      const stored = localStorage.getItem(SERVER_STORAGE_KEY);
      if (stored === 'seasonal' && this.seasonalAvailable) return 'seasonal';
      if (stored === 'classic') return 'classic';
    } catch {
      /* localStorage may be unavailable in private browsing or SSR */
    }
    return DEFAULT_SERVER;
  }
}
