import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { PlayerOnlineSummary, PlayerDetailsSummary } from '@core/models';
import { DAILY_WARN_MIN, DAILY_DANGER_MIN } from '@core/constants';
import { MinutesToHoursPipe } from '@shared/pipes';
import { MinimalistIconComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-online-stats',
  templateUrl: './player-online-stats.component.html',
  styleUrls: ['./player-online-stats.component.scss'],
  imports: [DatePipe, NgClass, MinutesToHoursPipe, MinimalistIconComponent],
})
export class PlayerOnlineStatsComponent {
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

  protected readonly serverResetLocalTime = computed(() => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: 'Europe/Madrid',
      timeZoneName: 'shortOffset',
    }).formatToParts(now);
    const offsetStr = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0';
    const match = offsetStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    const sign = match?.[1] === '+' ? 1 : -1;
    const hours = match ? parseInt(match[2]) : 0;
    const minutes = match ? parseInt(match[3] ?? '0') : 0;
    const madridOffsetMinutes = sign * (hours * 60 + minutes);
    const resetUTCMinutes = 17 * 60 - madridOffsetMinutes;
    const reset = new Date();
    reset.setUTCHours(Math.floor(resetUTCMinutes / 60), resetUTCMinutes % 60, 0, 0);
    return reset.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
  });
}
