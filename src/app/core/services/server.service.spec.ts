import { Injector } from '@angular/core';

import { DEFAULT_SERVER, SERVER_STORAGE_KEY } from '@core/constants';
import { environment } from '@env';
import { SEASONAL_ENABLED, ServerService } from './server.service';

describe('ServerService', () => {
  const key = SERVER_STORAGE_KEY;

  function setup(seasonalEnabled: boolean): ServerService {
    return Injector.create({
      providers: [{ provide: SEASONAL_ENABLED, useValue: seasonalEnabled }, ServerService],
    }).get(ServerService);
  }

  function setupDefault(): ServerService {
    return Injector.create({ providers: [ServerService] }).get(ServerService);
  }

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('initial resolution', () => {
    it('resolves classic when localStorage holds a stored classic', () => {
      localStorage.setItem(key, 'classic');
      expect(setup(true).server()).toBe('classic');
    });

    it('resolves seasonal when stored and the flag is enabled', () => {
      localStorage.setItem(key, 'seasonal');
      expect(setup(true).server()).toBe('seasonal');
    });

    it('falls back to the default when seasonal is stored but the flag is disabled', () => {
      localStorage.setItem(key, 'seasonal');
      expect(setup(false).server()).toBe(DEFAULT_SERVER);
    });

    it('falls back to the default when the stored value is invalid', () => {
      localStorage.setItem(key, 'garbage');
      expect(setup(true).server()).toBe(DEFAULT_SERVER);
    });

    it('falls back to the default when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage denied');
      });
      expect(setup(true).server()).toBe(DEFAULT_SERVER);
    });
  });

  describe('setServer', () => {
    it('rejects seasonal when the flag is disabled', () => {
      const service = setup(false);
      service.setServer('seasonal');
      expect(service.server()).toBe(DEFAULT_SERVER);
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('accepts classic even when the flag is disabled', () => {
      localStorage.setItem(key, 'seasonal');
      const service = setup(false);
      service.setServer('classic');
      expect(service.server()).toBe('classic');
    });

    it('is a no-op on the same value and does not persist', () => {
      localStorage.setItem(key, 'classic');
      const service = setup(true);
      const setItem = vi.spyOn(Storage.prototype, 'setItem');
      service.setServer('classic');
      expect(service.server()).toBe('classic');
      expect(setItem).not.toHaveBeenCalled();
    });

    it('switches the value and persists it', () => {
      const service = setup(true);
      service.setServer('seasonal');
      expect(service.server()).toBe('seasonal');
      expect(localStorage.getItem(key)).toBe('seasonal');
    });

    it('tolerates a throwing localStorage during persistence', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage denied');
      });
      const service = setup(true);
      expect(() => service.setServer('seasonal')).not.toThrow();
      expect(service.server()).toBe('seasonal');
    });
  });

  describe('toggleServer', () => {
    it('toggles classic -> seasonal when enabled', () => {
      const service = setup(true);
      service.toggleServer();
      expect(service.server()).toBe('seasonal');
    });

    it('toggles seasonal -> classic when enabled', () => {
      localStorage.setItem(key, 'seasonal');
      const service = setup(true);
      service.toggleServer();
      expect(service.server()).toBe('classic');
    });

    it('is a no-op when seasonal is disabled', () => {
      localStorage.setItem(key, 'classic');
      const service = setup(false);
      service.toggleServer();
      expect(service.server()).toBe('classic');
    });
  });

  describe('applyServerFromQueryParam', () => {
    it('applies classic regardless of the flag', () => {
      const service = setup(false);
      service.applyServerFromQueryParam('classic');
      expect(service.server()).toBe('classic');
    });

    it('applies seasonal only when enabled', () => {
      const service = setup(true);
      service.applyServerFromQueryParam('seasonal');
      expect(service.server()).toBe('seasonal');
    });

    it('ignores seasonal when disabled', () => {
      const service = setup(false);
      service.applyServerFromQueryParam('seasonal');
      expect(service.server()).toBe(DEFAULT_SERVER);
    });

    it('ignores garbage values', () => {
      const service = setup(true);
      service.applyServerFromQueryParam('banana');
      expect(service.server()).toBe(DEFAULT_SERVER);
    });

    it('ignores null', () => {
      const service = setup(true);
      service.applyServerFromQueryParam(null);
      expect(service.server()).toBe(DEFAULT_SERVER);
    });
  });

  describe('seasonalAvailable', () => {
    it('reflects the injected flag in both states', () => {
      expect(setup(true).seasonalAvailable).toBe(true);
      expect(setup(false).seasonalAvailable).toBe(false);
    });

    it('defaults to the environment value when no provider is given', () => {
      expect(setupDefault().seasonalAvailable).toBe(environment.seasonal.enabled);
    });
  });
});
