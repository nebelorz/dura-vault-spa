import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env';
import { ServerService } from './server.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly serverService = inject(ServerService);
  private _classicClient: SupabaseClient<any, any, any> | null = null;
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
