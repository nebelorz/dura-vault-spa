import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env';
import { ServerService } from './server.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly serverService = inject(ServerService);
  private readonly classicClient: SupabaseClient<any, any, any>;
  private readonly seasonalClient: SupabaseClient<any, any, any>;

  constructor() {
    this.classicClient = createClient(
      environment.classic.supabase.url,
      environment.classic.supabase.anonKey,
      { db: { schema: 'api' } },
    );
    this.seasonalClient = createClient(
      environment.seasonal.supabase.url,
      environment.seasonal.supabase.anonKey,
      { db: { schema: 'api' } },
    );
  }

  getClient(): SupabaseClient {
    return this.serverService.server() === 'seasonal' ? this.seasonalClient : this.classicClient;
  }
}
