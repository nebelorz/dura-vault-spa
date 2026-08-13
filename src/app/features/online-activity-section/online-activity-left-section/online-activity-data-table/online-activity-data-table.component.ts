import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OnlineTopRecord, PodiumListItem, PodiumListItemBadge, TimePeriod } from '@core/models';
import { DAILY_WARN_MIN, DAILY_DANGER_MIN } from '@core/constants';
import { buildMetrics } from '@shared/functions';
import { ErrorStatusComponent, PlayerActionsTableComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-activity-data-table',
  templateUrl: './online-activity-data-table.component.html',
  styleUrl: './online-activity-data-table.component.scss',
  imports: [PlayerActionsTableComponent, ErrorStatusComponent],
})
export class OnlineDataTableComponent {
  // Inputs
  data = input.required<OnlineTopRecord[]>();
  loading = input.required<boolean>();
  error = input(false);
  disabled = input(false);
  period = input.required<TimePeriod>();

  // Outputs
  retry = output<void>();

  // Computed
  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.data().map((record) => this.toDisplayItem(record)),
  );

  private toDisplayItem(record: OnlineTopRecord): PodiumListItem {
    const columns = buildMetrics('online', record, { period: this.period() }).map((col) => ({
      ...col,
      showIcon: false,
    }));

    return {
      id: record.name,
      rank: record.rank,
      name: record.name,
      meta: `${record.vocation} · Lvl ${record.level}`,
      columns,
      rowClass: this.rowTimeClass(record),
      badge: this.timeBadge(record),
    };
  }

  private rowTimeClass(record: OnlineTopRecord): string {
    if (record.average_online_time >= DAILY_DANGER_MIN) return 'list-row--danger';
    if (record.average_online_time >= DAILY_WARN_MIN) return 'list-row--warn';
    return '';
  }

  private timeBadge(record: OnlineTopRecord): PodiumListItemBadge | undefined {
    if (record.average_online_time >= DAILY_DANGER_MIN) return { text: '14h+', variant: 'danger' };
    if (record.average_online_time >= DAILY_WARN_MIN) return { text: '10h+', variant: 'warn' };
    return undefined;
  }
}
