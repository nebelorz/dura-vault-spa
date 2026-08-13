import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DeathRecord, PodiumListItem } from '@core/models';
import { PlayerActionsTableComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-deaths-data-table',
  templateUrl: './deaths-data-table.component.html',
  styleUrl: './deaths-data-table.component.scss',
  imports: [PlayerActionsTableComponent],
})
export class DeathsDataTableComponent {
  // Inputs
  data = input.required<DeathRecord[]>();
  loading = input.required<boolean>();

  // Computed
  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.data().map((record, index) => this.toDisplayItem(record, index)),
  );

  private toDisplayItem(record: DeathRecord, index: number): PodiumListItem {
    return {
      id: String(record.id),
      rank: index + 1,
      name: record.player_name,
      meta: `Lvl ${record.player_level}`,
      columns: [
        {
          metric: 'killer_name',
          displayValue: record.killer_name,
          showIcon: false,
          showLabel: true,
          layout: 'column',
          size: 'md',
        },
        {
          metric: 'death_time',
          displayValue: this.formatDeathTime(record.died_at),
          showIcon: false,
          showLabel: true,
          layout: 'column',
          size: 'md',
          valueClass: 'text-subvalue',
        },
      ],
      rowClass: record.is_pvp ? 'list-row--danger' : 'list-row--warn',
      badge: {
        text: record.is_pvp ? 'PvP' : 'PvE',
        variant: record.is_pvp ? 'danger' : 'warn',
      },
    };
  }

  private formatDeathTime(isoString: string): string {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }
}
