import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { PlayerOnlineSummary, PlayerDetailsSummary } from '@core/models';
import { DAILY_WARN_MIN, DAILY_DANGER_MIN } from '@core/constants';
import { MinutesToHoursPipe } from '@shared/pipes';
import { MinimalistIconComponent } from "@shared/components";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-online-stats-summary',
  templateUrl: './player-online-stats-summary.component.html',
  styleUrls: ['./player-online-stats-summary.component.scss'],
  imports: [DatePipe, NgClass, MinutesToHoursPipe, MinimalistIconComponent],
})
export class PlayerOnlineStatsSummaryComponent {
  onlineSummary = input<PlayerOnlineSummary | null>(null);
  summary = input<PlayerDetailsSummary | null>(null);

  protected readonly avgRowClass = computed(() => {
    const avg = this.onlineSummary()?.average_online_time ?? 0;
    if (avg >= DAILY_DANGER_MIN) return 'stat-row--danger';
    if (avg >= DAILY_WARN_MIN) return 'stat-row--warn';
    return '';
  });

  protected readonly avgIconClass = computed(() => {
    const avg = this.onlineSummary()?.average_online_time ?? 0;
    if (avg >= DAILY_DANGER_MIN) return 'stat-icon--danger';
    if (avg >= DAILY_WARN_MIN) return 'stat-icon--warn';
    return 'stat-icon--primary';
  });
}
