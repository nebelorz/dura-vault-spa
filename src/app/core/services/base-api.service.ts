import { inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

export abstract class BaseApiService {
  private readonly supabaseService = inject(SupabaseService);
  protected readonly toastService = inject(ToastService);

  protected get supabase(): SupabaseClient {
    return this.supabaseService.getClient();
  }

  protected async fetchRpc<T>(
    rpcName: string,
    params: Record<string, unknown> | object,
    options: {
      errorContext: string;
      errorTitle?: string;
      showErrorToast?: boolean;
    },
  ): Promise<T | null> {
    const { errorContext, errorTitle = 'Error', showErrorToast = true } = options;

    try {
      const { data, error } = await this.supabase.rpc(rpcName, params);

      if (error) {
        const errorMessage = `Failed to load ${errorContext}`;
        console.error(`Error loading ${errorContext}:`, error);

        if (showErrorToast) {
          this.toastService.error(errorMessage, errorTitle);
        }

        return null;
      }

      return data as T;
    } catch (err) {
      const errorMessage = `An unexpected error occurred while loading ${errorContext}`;
      console.error('Unexpected error:', err);

      if (showErrorToast) {
        this.toastService.error(errorMessage, errorTitle);
      }

      return null;
    }
  }
}
