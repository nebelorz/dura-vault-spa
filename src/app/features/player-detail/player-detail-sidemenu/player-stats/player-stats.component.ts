import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerStatsRecord, HighscoreSection, Section } from '@core/models';
import { getSectionLabel, METRIC_ICONS, HIGHSCORE_SECTIONS } from '@core/constants';
import { LoadingStatusComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrl: './player-stats.component.scss',
  imports: [LoadingStatusComponent, DatePipe],
})
export class PlayerStatsComponent {
  stats = input.required<PlayerStatsRecord[]>();
  loading = input.required<boolean>();
  activeSection = input.required<HighscoreSection>();
  sectionSelect = output<HighscoreSection>();

  protected readonly METRIC_ICONS = METRIC_ICONS;
  protected readonly getSectionLabel = (section: string) => getSectionLabel(section as Section);

  selectSection(section: string): void {
    this.sectionSelect.emit(section as HighscoreSection);
  }

  readonly experienceStat = computed(
    () => this.stats().find((stat) => stat.section === 'experience') ?? null,
  );

  readonly skillStats = computed(() =>
    this.stats()
      .filter((stat) => stat.section !== 'experience' && stat.section !== 'experience_loss')
      .sort((a, b) => this.sectionOrder(a.section) - this.sectionOrder(b.section)),
  );

  hasNegativeGain(stat: PlayerStatsRecord): boolean {
    return stat.last_gain_level !== null && stat.last_gain_level < 0;
  }

  private sectionOrder(section: string): number {
    return HIGHSCORE_SECTIONS.findIndex((s) => s.value === section);
  }
}
