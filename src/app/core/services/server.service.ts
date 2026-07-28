import { Injectable, signal, inject } from '@angular/core';
import { ServerId, SERVER_STORAGE_KEY, DEFAULT_SERVER } from '@core/constants';
import { CacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly cacheService = inject(CacheService);
  private readonly _server = signal<ServerId>(this.getInitialServer());
  readonly server = this._server.asReadonly();

  setServer(server: ServerId): void {
    if (this._server() !== server) {
      this._server.set(server);
      this.cacheService.clearAll();
      this.persist();
    }
  }

  toggleServer(): void {
    this.setServer(this._server() === 'classic' ? 'seasonal' : 'classic');
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
      if (stored === 'seasonal' || stored === 'classic') return stored;
    } catch {
      /* localStorage may be unavailable in private browsing or SSR */
    }
    return DEFAULT_SERVER;
  }
}
