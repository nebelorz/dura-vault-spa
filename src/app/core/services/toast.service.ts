import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastOptions {
  severity: ToastSeverity;
  summary?: string;
  detail: string;
  life?: number;
  sticky?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  /**
   * Display a toast message
   * @param options Toast configuration options
   */
  show(options: ToastOptions): void {
    this.messageService.add({
      severity: options.severity,
      summary: options.summary || this.getDefaultSummary(options.severity),
      detail: options.detail,
      life: options.life ?? 3000,
      sticky: options.sticky ?? false,
    });
  }

  /**
   * Display a success toast message
   * @param detail Message content
   * @param summary Optional summary/title
   * @param life Optional duration in milliseconds (default: 3000)
   */
  success(detail: string, summary?: string, life?: number): void {
    this.show({
      severity: 'success',
      detail,
      summary,
      life,
    });
  }

  /**
   * Display an info toast message
   * @param detail Message content
   * @param summary Optional summary/title
   * @param life Optional duration in milliseconds (default: 3000)
   */
  info(detail: string, summary?: string, life?: number): void {
    this.show({
      severity: 'info',
      detail,
      summary,
      life,
    });
  }

  /**
   * Display a warning toast message
   * @param detail Message content
   * @param summary Optional summary/title
   * @param life Optional duration in milliseconds (default: 3000)
   */
  warn(detail: string, summary?: string, life?: number): void {
    this.show({
      severity: 'warn',
      detail,
      summary,
      life,
    });
  }

  /**
   * Display an error toast message
   * @param detail Message content
   * @param summary Optional summary/title
   * @param life Optional duration in milliseconds (default: 5000)
   */
  error(detail: string, summary?: string, life?: number): void {
    this.show({
      severity: 'error',
      detail,
      summary,
      life: life ?? 5000, // Error messages last longer by default
    });
  }

  /**
   * Clear all toast messages
   */
  clear(): void {
    this.messageService.clear();
  }

  /**
   * Get default summary text based on severity
   */
  private getDefaultSummary(severity: ToastSeverity): string {
    switch (severity) {
      case 'success':
        return 'Success';
      case 'info':
        return 'Info';
      case 'warn':
        return 'Warning';
      case 'error':
        return 'Error';
    }
  }
}
