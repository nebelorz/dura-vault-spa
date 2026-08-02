import { signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import type { ToastService } from './toast.service';

export abstract class BaseApiService {
  protected abstract get supabase(): SupabaseClient;
  protected abstract toastService: ToastService;

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

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

    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabase.rpc(rpcName, params);

      if (error) {
        const errorMessage = `Failed to load ${errorContext}`;
        console.error(`Error loading ${errorContext}:`, error);
        this.error.set(errorMessage);

        if (showErrorToast) {
          this.toastService.error(errorMessage, errorTitle);
        }

        return null;
      }

      return data as T;
    } catch (err) {
      const errorMessage = `An unexpected error occurred while loading ${errorContext}`;
      console.error('Unexpected error:', err);
      this.error.set(errorMessage);

      if (showErrorToast) {
        this.toastService.error(errorMessage, errorTitle);
      }

      return null;
    } finally {
      this.loading.set(false);
    }
  }
}
