import { inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { MessageService } from 'primeng/api';

import { SupabaseService } from './supabase.service';

export abstract class BaseApiService {
  private readonly supabaseService = inject(SupabaseService);
  protected readonly messageService = inject(MessageService);

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
      fetchAll?: boolean;
      pageSize?: number;
    },
  ): Promise<T | null> {
    const {
      errorContext,
      errorTitle = 'Error',
      showErrorToast = true,
      fetchAll = false,
      pageSize = 1000,
    } = options;

    try {
      if (fetchAll) {
        const merged: unknown[] = [];

        for (let offset = 0; ; offset += pageSize) {
          const { data, error } = await this.supabase
            .rpc(rpcName, params)
            .range(offset, offset + pageSize - 1);

          if (error) {
            const errorMessage = `Failed to load ${errorContext}`;
            console.error(`Error loading ${errorContext}:`, error);

            if (showErrorToast) {
              this.messageService.add({
                severity: 'error',
                summary: errorTitle,
                detail: errorMessage,
                life: 8000,
              });
            }

            return null;
          }

          const page = (data ?? []) as unknown[];
          merged.push(...page);

          if (page.length < pageSize) {
            break;
          }
        }

        return merged as T;
      }

      const { data, error } = await this.supabase.rpc(rpcName, params);

      if (error) {
        const errorMessage = `Failed to load ${errorContext}`;
        console.error(`Error loading ${errorContext}:`, error);

        if (showErrorToast) {
          this.messageService.add({
            severity: 'error',
            summary: errorTitle,
            detail: errorMessage,
            life: 8000,
          });
        }

        return null;
      }

      return data as T;
    } catch (err) {
      const errorMessage = `An unexpected error occurred while loading ${errorContext}`;
      console.error('Unexpected error:', err);

      if (showErrorToast) {
        this.messageService.add({
          severity: 'error',
          summary: errorTitle,
          detail: errorMessage,
          life: 8000,
        });
      }

      return null;
    }
  }
}
