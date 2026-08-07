import { Injector } from '@angular/core';
import { DefaultUrlSerializer } from '@angular/router';

import { ServerId } from '@core/constants';
import { SEASONAL_ENABLED, ServerService } from './server.service';
import { ServerAwareUrlSerializer } from './server-aware-url-serializer';

describe('ServerAwareUrlSerializer', () => {
  const defaultSerializer = new DefaultUrlSerializer();

  function setup(seasonalEnabled: boolean, server: ServerId = 'classic'): ServerAwareUrlSerializer {
    const injector = Injector.create({
      providers: [
        { provide: SEASONAL_ENABLED, useValue: seasonalEnabled },
        ServerService,
        ServerAwareUrlSerializer,
      ],
    });
    injector.get(ServerService).setServer(server);
    return injector.get(ServerAwareUrlSerializer);
  }

  function tree(url: string) {
    return defaultSerializer.parse(url);
  }

  describe('serialize', () => {
    it('appends the server query param when seasonal is enabled and none is present', () => {
      const serializer = setup(true, 'classic');
      expect(serializer.serialize(tree('/player/Name'))).toBe('/player/Name?server=classic');
    });

    it('appends the current server value', () => {
      const serializer = setup(true, 'seasonal');
      expect(serializer.serialize(tree('/player/Name'))).toBe('/player/Name?server=seasonal');
    });

    it('preserves an existing server param when seasonal is enabled', () => {
      const serializer = setup(true, 'classic');
      expect(serializer.serialize(tree('/player/Name?server=seasonal'))).toBe(
        '/player/Name?server=seasonal',
      );
    });

    it('strips a stale server param when seasonal is disabled', () => {
      const serializer = setup(false);
      expect(serializer.serialize(tree('/player/Name?server=seasonal'))).toBe('/player/Name');
    });

    it('leaves the URL unchanged when seasonal is disabled and no server param is present', () => {
      const serializer = setup(false);
      expect(serializer.serialize(tree('/player/Name?tab=characters'))).toBe(
        '/player/Name?tab=characters',
      );
    });

    it('preserves a fragment when appending the server param', () => {
      const serializer = setup(true, 'classic');
      expect(serializer.serialize(tree('/player/Name#top'))).toBe(
        '/player/Name?server=classic#top',
      );
    });
  });

  describe('parse', () => {
    it('delegates to DefaultUrlSerializer', () => {
      const serializer = setup(true);
      const url = '/player/Name?server=classic';
      expect(serializer.parse(url)).toEqual(defaultSerializer.parse(url));
    });
  });
});
