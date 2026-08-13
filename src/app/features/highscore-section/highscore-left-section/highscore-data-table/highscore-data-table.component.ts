import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HighscoreRecord, PodiumListItem, Section } from '@core/models';
import { buildMetrics } from '@shared/functions';
import { PlayerActionsTableComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-data-table',
  templateUrl: './highscore-data-table.component.html',
  styleUrl: './highscore-data-table.component.scss',
  host: { '[class.podium-danger-mode]': 'isLoss()' },
  imports: [PlayerActionsTableComponent],
})
export class HighscoreDataTableComponent {
  // Inputs
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  // Computed
  protected readonly isLoss = computed(() => this.section() === 'experience_loss');

  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.data().map((record) => this.toDisplayItem(record, this.section())),
  );

  protected readonly playerSection = computed(() =>
    this.section() === 'experience_loss' ? 'experience' : this.section(),
  );

  private toDisplayItem(record: HighscoreRecord, section: Section): PodiumListItem {
    const group = section === 'experience' || section === 'experience_loss' ? 'level' : 'skill';
    const columns = buildMetrics(group, record);
    return {
      id: record.name,
      rank: record.rank,
      name: record.name,
      meta: record.vocation,
      columns,
    };
  }
}
