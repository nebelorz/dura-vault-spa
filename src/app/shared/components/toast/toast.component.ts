import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastMessage, ToastService } from '@core/services';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [],
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly messages = signal<ToastMessage[]>([]);

  constructor() {
    this.toastService.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((messages) => this.messages.set(messages));
  }

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
