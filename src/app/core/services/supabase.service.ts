import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env';
import { ServerService } from './server.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly serverService = inject(ServerService);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- schema-generic invariance: clients are created with { db: { schema: 'api' } }, which bare SupabaseClient generics can't express
  private _classicClient: SupabaseClient<any, any, any> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _seasonalClient: SupabaseClient<any, any, any> | null = null;

  getClient(): SupabaseClient {
    if (this.serverService.server() === 'seasonal') {
      if (!this._seasonalClient) {
        this._seasonalClient = createClient(
          environment.seasonal.supabase.url,
          environment.seasonal.supabase.anonKey,
          { db: { schema: 'api' } },
        );
      }
      return this._seasonalClient;
    }

    if (!this._classicClient) {
      this._classicClient = createClient(
        environment.classic.supabase.url,
        environment.classic.supabase.anonKey,
        { db: { schema: 'api' } },
      );
    }
    return this._classicClient;
  }
}
