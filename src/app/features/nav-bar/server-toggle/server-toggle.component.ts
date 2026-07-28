import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ServerService } from '@core/services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-server-toggle',
  templateUrl: './server-toggle.component.html',
  styleUrl: './server-toggle.component.scss',
  imports: [ButtonModule],
})
export class ServerToggleComponent {
  private readonly serverService = inject(ServerService);
  readonly toggling = signal(false);

  readonly label = computed(() =>
    this.serverService.server() === 'seasonal' ? 'Seasonal' : 'Classic',
  );
  readonly icon = 'pi pi-globe';
  readonly severity = computed(() =>
    this.serverService.server() === 'seasonal' ? 'danger' : 'primary',
  );
  readonly buttonClass = computed(() =>
    this.serverService.server() === 'seasonal' ? 'seasonal-active' : '',
  );

  toggle(): void {
    if (this.toggling()) return;

    this.serverService.toggleServer();
    this.toggling.set(true);

    setTimeout(() => {
      this.toggling.set(false);
    }, 600);
  }
}
