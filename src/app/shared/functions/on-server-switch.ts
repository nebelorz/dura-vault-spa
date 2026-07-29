import { effect, untracked } from '@angular/core';
import { ServerService } from '@core/services';
import { ServerId } from '@core/constants';

/**
 * Registers an effect that invokes `action` whenever the server switches
 * (classic ↔ seasonal). The action is called outside the reactive tracking
 * context so that any signals read inside `action` do not become
 * dependencies of the effect.
 *
 * Must be called from an injection context (e.g., a component constructor).
 *
 * @param serverService - The ServerService instance (inject it in the caller).
 * @param action - Callback to run when the server changes. Use `void` for
 *                 async calls to clarify fire-and-forget intent.
 */
export function onServerSwitch(serverService: ServerService, action: () => void): void {
  let previousServer: ServerId | null = null;

  effect(() => {
    const currentServer = serverService.server();
    const prev = previousServer;
    previousServer = currentServer;

    if (prev !== null && prev !== currentServer) {
      untracked(action);
    }
  });
}
