import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { PlayerOnlineSummary } from '@core/models';
import { DAILY_WARN_MIN, DAILY_DANGER_MIN } from '@core/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-online-stats-summary',
  templateUrl: './player-online-stats-summary.component.html',
  styleUrls: ['./player-online-stats-summary.component.scss'],
  imports: [DatePipe, NgClass],
})
export class PlayerOnlineStatsSummaryComponent {
  onlineSummary = input<PlayerOnlineSummary | null>(null);

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

  formatOnlineAvg(minutesPerDay: number): string {
    const h = Math.floor(minutesPerDay / 60);
    const m = Math.round(minutesPerDay % 60);
    if (h === 0) return `${m}m/day`;
    if (m === 0) return `${h}h/day`;
    return `${h}h ${m}m/day`;
  }
}
