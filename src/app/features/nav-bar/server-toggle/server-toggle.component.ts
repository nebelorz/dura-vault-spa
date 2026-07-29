import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ServerService } from '@core/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-server-toggle',
  templateUrl: './server-toggle.component.html',
  styleUrl: './server-toggle.component.scss',
  imports: [ButtonModule],
})
export class ServerToggleComponent implements OnDestroy {
  private readonly serverService = inject(ServerService);
  private readonly router = inject(Router);
  readonly toggling = signal(false);
  private toggleTimer: ReturnType<typeof setTimeout> | null = null;

  readonly config = computed(() => {
    const isSeasonal = this.serverService.server() === 'seasonal';
    return {
      label: isSeasonal ? 'Seasonal' : 'Classic',
      severity: isSeasonal ? 'danger' : 'primary',
      styleClass: isSeasonal ? 'seasonal-active' : '',
    } as const;
  });
  readonly icon = 'pi pi-globe';
  readonly seasonalDisabled: boolean = !this.serverService.seasonalAvailable;

  ngOnDestroy(): void {
    if (this.toggleTimer) {
      clearTimeout(this.toggleTimer);
      this.toggleTimer = null;
    }
  }

  async toggle(): Promise<void> {
    if (this.toggling()) return;

    this.serverService.toggleServer();
    this.toggling.set(true);

    try {
      await this.router.navigate([], {
        queryParams: { server: this.serverService.server() },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } catch (err) {
      console.warn('[ServerToggle] Navigation failed after server switch', err);
    } finally {
      if (this.toggleTimer) clearTimeout(this.toggleTimer);
      this.toggleTimer = setTimeout(() => {
        this.toggling.set(false);
        this.toggleTimer = null;
      }, 600);
    }
  }
}
