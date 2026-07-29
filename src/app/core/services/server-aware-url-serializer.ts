import { Injectable, inject } from '@angular/core';
import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';
import { ServerService } from './server.service';

/**
 * Custom UrlSerializer that automatically appends `?server=` to every internal URL
 * based on the current `ServerService` value.
 *
 * This ensures all navigations (routerLink, navigate(), navigateByUrl())
 * carry the server context so shared URLs always preserve the server.
 */
@Injectable({ providedIn: 'root' })
export class ServerAwareUrlSerializer implements UrlSerializer {
  private readonly defaultSerializer = new DefaultUrlSerializer();
  private readonly serverService = inject(ServerService);

  parse(url: string): UrlTree {
    return this.defaultSerializer.parse(url);
  }

  serialize(tree: UrlTree): string {
    if (this.serverService.seasonalAvailable) {
      if (!tree.queryParamMap.has('server')) {
        // Clone the UrlTree to avoid mutating the original tree object.
        // Note: clone.root shares the same TreeNode reference as tree.root.
        // UrlTree objects are short-lived in Angular, so this is acceptable.
        const clone = new UrlTree();
        clone.root = tree.root;
        clone.queryParams = { ...tree.queryParams, server: this.serverService.server() };
        clone.fragment = tree.fragment;
        return this.defaultSerializer.serialize(clone);
      }
      // Already has a server param — preserve it as-is.
      return this.defaultSerializer.serialize(tree);
    }

    // Seasonal is disabled — strip any stale ?server= param from the URL.
    if (tree.queryParamMap.has('server')) {
      const clone = new UrlTree();
      clone.root = tree.root;
      const { server: _, ...rest } = tree.queryParams;
      clone.queryParams = rest;
      clone.fragment = tree.fragment;
      return this.defaultSerializer.serialize(clone);
    }

    return this.defaultSerializer.serialize(tree);
  }
}
