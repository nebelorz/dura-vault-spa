import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerOnlineSummary } from '@core/models';
import { InlineLoadingComponent, MinimalistIconComponent } from '@shared/components';
import { MinutesToHoursPipe } from '@shared/pipes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-player-online-stats',
  templateUrl: './player-online-stats.component.html',
  styleUrl: './player-online-stats.component.scss',
  imports: [DatePipe, InlineLoadingComponent, MinimalistIconComponent, MinutesToHoursPipe],
})
export class PlayerOnlineStatsComponent {
  loading = input.required<boolean>();
  onlineSummary = input<PlayerOnlineSummary | null>(null);
  lastLogin = input<string | null>(null);

  protected readonly hasOnlineSummary = computed(
    () => (this.onlineSummary()?.average_online_time ?? 0) > 0,
  );

  protected readonly hasContent = computed(
    () => this.hasOnlineSummary() || this.lastLogin() !== null,
  );
}
