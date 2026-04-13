import { inject, Injectable } from '@angular/core';

import { CharacterProfileData, CharacterProfileResult } from '@core/models';
import { CacheService } from './cache.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CharacterProfileService {
  private readonly cacheService = inject(CacheService);
  private readonly toastService = inject(ToastService);

  async getCharacterProfile(name: string): Promise<CharacterProfileResult> {
    const key = `character_profile_${name}`;
    const cached = this.cacheService.get<CharacterProfileResult>(key);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/character/${encodeURIComponent(name)}`);
      if (res.status === 404) return { status: 'not_found' };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CharacterProfileData = await res.json();
      const result: CharacterProfileResult = { status: 'found', data };
      this.cacheService.set(key, result);
      return result;
    } catch {
      this.toastService.warn('Could not load character details from Dura page.');
      return { status: 'error' };
    }
  }
}
