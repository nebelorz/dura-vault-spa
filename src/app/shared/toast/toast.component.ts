import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [CommonModule],
})
export class ToastComponent implements OnDestroy {
  private readonly toastService = inject(ToastService);
  private readonly subscription: Subscription;

  protected readonly messages = signal<ToastMessage[]>([]);

  constructor() {
    this.subscription = this.toastService.messages$.subscribe((messages) => {
      this.messages.set(messages);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Closes a specific toast message
   */
  protected closeToast(id: string): void {
    this.toastService.remove(id);
  }

  /**
   * Get the container position class
   */
  protected getPositionClass(position: string): string {
    return `toast-container-${position}`;
  }
}
