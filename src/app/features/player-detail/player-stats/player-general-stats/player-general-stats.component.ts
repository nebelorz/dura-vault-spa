import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerStatsRecord, HighscoreSection, Section } from '@core/models';
import { getSectionLabel } from '@core/constants';
import { LoadingStatusComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-general-stats',
  templateUrl: './player-general-stats.component.html',
  styleUrls: ['./player-general-stats.component.scss'],
  imports: [LoadingStatusComponent, DatePipe],
})
export class PlayerGeneralStatsComponent {
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
      .sort((a, b) => {
        if (a.section === 'magic') return -1;
        if (b.section === 'magic') return 1;
        return a.section.localeCompare(b.section);
      }),
  );
}
