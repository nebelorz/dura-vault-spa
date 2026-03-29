import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerStatsRecord, HighscoreSection, Section } from '@core/models';
import { getSectionLabel } from '@core/constants';
import { LoadingStatusComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-stats-card',
  templateUrl: './player-stats-card.component.html',
  styleUrls: ['./player-stats-card.component.scss'],
  imports: [LoadingStatusComponent, DatePipe],
})
export class PlayerStatsCardComponent {
  stats = input.required<PlayerStatsRecord[]>();
  loading = input.required<boolean>();
  activeSection = input.required<HighscoreSection>();
  sectionSelect = output<HighscoreSection>();

  protected readonly getSectionLabel = (section: string) => getSectionLabel(section as Section);

  onStatClick(section: string): void {
    this.sectionSelect.emit(section as HighscoreSection);
  }

  readonly experienceStat = computed(
    () => this.stats().find((s) => s.section === 'experience') ?? null,
  );

  readonly skillStats = computed(() =>
    this.stats()
      .filter((s) => s.section !== 'experience' && s.section !== 'experience_loss')
      .sort((a, b) => a.section.localeCompare(b.section)),
  );
}
