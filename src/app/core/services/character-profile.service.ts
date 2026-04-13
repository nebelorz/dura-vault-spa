import { inject, Injectable, signal } from '@angular/core';

import { CharacterProfileData, CharacterProfileResult } from '@core/models';
import { CacheService } from './cache.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CharacterProfileService {
  private readonly cacheService = inject(CacheService);
  private readonly toastService = inject(ToastService);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async getCharacterProfile(name: string): Promise<CharacterProfileResult> {
    const key = `character_profile_${name}`;
    const cached = this.cacheService.get<CharacterProfileResult>(key);
    if (cached) return cached;

    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`/api/character/${encodeURIComponent(name)}`);
      if (res.status === 404) return { status: 'not_found' };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CharacterProfileData = await res.json();
      const result: CharacterProfileResult = { status: 'found', data };
      this.cacheService.set(key, result);
      return result;
    } catch {
      const errorMessage = 'Could not load character details from Dura page.';
      this.error.set(errorMessage);
      this.toastService.warn(errorMessage);
      return { status: 'error' };
    } finally {
      this.loading.set(false);
    }
  }

  clearAllData(): void {
    this.cacheService.clearByPattern('character_profile');
  }
}
