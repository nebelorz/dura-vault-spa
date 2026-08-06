import { inject, Injectable } from '@angular/core';

import { CharacterProfileData, CharacterProfileResult } from '@core/models';
import { ServerService } from './server.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class CharacterProfileService {
  private readonly serverService = inject(ServerService);
  private readonly toastService = inject(ToastService);

  async getCharacterProfile(name: string): Promise<CharacterProfileResult> {
    const server = this.serverService.server();

    try {
      const params = new URLSearchParams();
      if (server === 'seasonal') params.set('server', 'seasonal');
      const qs = params.toString();
      const url = `/api/character/${encodeURIComponent(name)}${qs ? '?' + qs : ''}`;
      const res = await fetch(url);
      if (res.status === 404) return { status: 'not_found' };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: CharacterProfileData = await res.json();
      const result: CharacterProfileResult = { status: 'found', data };
      return result;
    } catch {
      const errorMessage = 'Could not load character details from Dura page.';
      this.toastService.warn(errorMessage);
      return { status: 'error' };
    }
  }
}
