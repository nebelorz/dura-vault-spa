import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'center';

export interface ToastMessage {
  id: string;
  severity: ToastSeverity;
  summary?: string;
  detail: string;
  life?: number;
  sticky?: boolean;
  icon?: string;
  background?: string;
  color?: string;
  borderColor?: string;
  position: ToastPosition;
  closing?: boolean;
}

export interface ToastOptions {
  severity: ToastSeverity;
  summary?: string;
  detail: string;
  life?: number;
  sticky?: boolean;
  icon?: string;
  background?: string;
  color?: string;
  borderColor?: string;
  position?: ToastPosition;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private static readonly ANIMATION_DURATION = 300;
  private static readonly DEFAULT_LIFE = 5000;
  private static readonly ERROR_LIFE = 8000;

  private readonly messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public readonly messages$: Observable<ToastMessage[]> = this.messagesSubject.asObservable();
  private readonly timeouts = new Map<string, number>();

  /**
   * Display a toast message
   */
  show(options: ToastOptions): void {
    const message = this.createMessage(options);
    this.addMessage(message);

    if (!message.sticky) {
      this.scheduleRemoval(message.id, message.life!);
    }
  }

  /**
   * Display a success toast message
   */
  success(detail: string, summary?: string, life?: number, position?: ToastPosition): void {
    this.show({ severity: 'success', detail, summary, life, position });
  }

  /**
   * Display an info toast message
   */
  info(detail: string, summary?: string, life?: number, position?: ToastPosition): void {
    this.show({ severity: 'info', detail, summary, life, position });
  }

  /**
   * Display a warning toast message
   */
  warn(detail: string, summary?: string, life?: number, position?: ToastPosition): void {
    this.show({ severity: 'warn', detail, summary, life, position });
  }

  /**
   * Display an error toast message
   */
  error(detail: string, summary?: string, life?: number, position?: ToastPosition): void {
    this.show({
      severity: 'error',
      detail,
      summary,
      life: life ?? ToastService.ERROR_LIFE,
      position,
    });
  }

  /**
   * Remove a specific toast message with animation
   */
  remove(id: string): void {
    this.clearTimeout(id);
    this.markAsClosing(id);
    this.scheduleMessageRemoval(id);
  }

  /**
   * Clear all toast messages
   */
  clear(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
    this.messagesSubject.next([]);
  }

  private createMessage(options: ToastOptions): ToastMessage {
    return {
      id: this.generateId(),
      severity: options.severity,
      summary: options.summary || this.getDefaultSummary(options.severity),
      detail: options.detail,
      life: options.life ?? ToastService.DEFAULT_LIFE,
      sticky: options.sticky ?? false,
      icon: options.icon || this.getDefaultIcon(options.severity),
      background: options.background,
      color: options.color,
      borderColor: options.borderColor,
      position: options.position || 'top-right',
    };
  }

  private addMessage(message: ToastMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private scheduleRemoval(id: string, delay: number): void {
    const timeout = setTimeout(() => this.remove(id), delay);
    this.timeouts.set(id, timeout as unknown as number);
  }

  private clearTimeout(id: string): void {
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }
  }

  private markAsClosing(id: string): void {
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = currentMessages.map((msg) =>
      msg.id === id ? { ...msg, closing: true } : msg,
    );
    this.messagesSubject.next(updatedMessages);
  }

  private scheduleMessageRemoval(id: string): void {
    setTimeout(() => {
      const messages = this.messagesSubject.value;
      this.messagesSubject.next(messages.filter((msg) => msg.id !== id));
    }, ToastService.ANIMATION_DURATION);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  private getDefaultSummary(severity: ToastSeverity): string {
    const summaries: Record<ToastSeverity, string> = {
      success: 'Success',
      info: 'Info',
      warn: 'Warning',
      error: 'Error',
    };
    return summaries[severity];
  }

  private getDefaultIcon(severity: ToastSeverity): string {
    const icons: Record<ToastSeverity, string> = {
      success: 'pi pi-check-circle',
      info: 'pi pi-info-circle',
      warn: 'pi pi-exclamation-triangle',
      error: 'pi pi-times-circle',
    };
    return icons[severity];
  }
}
