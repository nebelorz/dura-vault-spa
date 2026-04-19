import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { HighscoreSection, PlayerDetailsSummary } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';
import { InlineLoadingComponent, MinimalistIconComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-records',
  templateUrl: './player-records.component.html',
  styleUrl: './player-records.component.scss',
  imports: [DatePipe, NgClass, AbbreviateNumberPipe, InlineLoadingComponent, MinimalistIconComponent],
})
export class PlayerRecordsComponent {
  summary = input<PlayerDetailsSummary | null>(null);
  section = input.required<HighscoreSection>();
  loading = input.required<boolean>();

  readonly bestDayMetricClass = computed(() => {
    const s = this.summary();
    if (!s?.best_day?.date) return '';
    const v =
      this.section() === 'experience'
        ? (s.best_day.gain_points ?? 0)
        : (s.best_day.gain_level ?? 0);
    if (v > 0) return this.section() === 'experience' ? 'metric--xp' : 'metric--skill';
    return v < 0 ? 'metric--danger' : '';
  });

  readonly worstDayMetricClass = computed(() => {
    const s = this.summary();
    if (!s?.worst_day?.date) return '';
    const v =
      this.section() === 'experience'
        ? (s.worst_day.gain_points ?? 0)
        : (s.worst_day.gain_level ?? 0);
    if (v > 0) return this.section() === 'experience' ? 'metric--xp' : 'metric--skill';
    return v < 0 ? 'metric--danger' : '';
  });

  readonly dayRowClass = computed(() =>
    this.section() === 'experience' ? 'record-row--xp' : 'record-row--skill',
  );
}
