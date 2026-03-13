import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerOnlineSummary } from '@core/models';

@Component({
  selector: 'app-player-online-stats-summary',
  templateUrl: './player-online-stats-summary.component.html',
  styleUrls: ['./player-online-stats-summary.component.scss'],
  imports: [DatePipe],
})
export class PlayerOnlineStatsSummaryComponent {
  onlineSummary = input<PlayerOnlineSummary | null>(null);

  formatOnlineAvg(minutesPerDay: number): string {
    const h = Math.floor(minutesPerDay / 60);
    const m = Math.round(minutesPerDay % 60);
    if (h === 0) return `${m}m/day`;
    if (m === 0) return `${h}h/day`;
    return `${h}h ${m}m/day`;
  }
}
