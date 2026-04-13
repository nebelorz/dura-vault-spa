import { inject, Injectable } from '@angular/core';

import { CharacterProfileData } from '@core/models';
import { CacheService } from './cache.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CharacterProfileService {
  private readonly cacheService = inject(CacheService);
  private readonly toastService = inject(ToastService);

  async getCharacterProfile(name: string): Promise<CharacterProfileData | null> {
    const key = `character_profile_${name}`;
    const cached = this.cacheService.get<CharacterProfileData>(key);
    if (cached) return cached;

    try {
      const res = await fetch(`/api/character/${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CharacterProfileData = await res.json();
      this.cacheService.set(key, data);
      return data;
    } catch {
      this.toastService.warn('Could not load character details from Dura page.');
      return null;
    }
  }
}
