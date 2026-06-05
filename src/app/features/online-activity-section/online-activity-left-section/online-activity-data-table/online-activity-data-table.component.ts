import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  inject,
  signal,
  viewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { OnlineTopRecord, TimePeriod } from '@core/models';
import { ToastService } from '@core/services';
import { DAILY_WARN_MIN, DAILY_DANGER_MIN } from '@core/constants';
import { formatMinutesToHours, getDuraPlayerUrl } from '@shared/functions';
import { PodiumListComponent, PodiumListItem, TextColumn } from '@shared/components';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-activity-data-table',
  templateUrl: './online-activity-data-table.component.html',
  styleUrl: './online-activity-data-table.component.scss',
  imports: [ContextMenuModule, PodiumListComponent],
})
export class OnlineDataTableComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  // Inputs
  data = input.required<OnlineTopRecord[]>();
  loading = input.required<boolean>();
  period = input.required<TimePeriod>();

  // State
  private selectedRecord: OnlineTopRecord | null = null;

  // Child
  private readonly cm = viewChild<ContextMenu>('cm');

  // Computed
  private readonly filterValue = signal<string>('');
  private readonly trimmedFilter = computed(() => this.filterValue().trim());
  readonly hasFilter = computed(() => this.trimmedFilter().length > 0);
  private readonly filteredData = computed(() => {
    const filter = this.trimmedFilter().toLowerCase();
    if (!filter) return this.data();
    return this.data().filter((r) => r.name.toLowerCase().includes(filter));
  });

  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.filteredData().map((record) => this.toDisplayItem(record)),
  );

  // Context menu
  readonly contextMenuItems: MenuItem[] = [
    {
      label: 'Details',
      icon: 'pi pi-eye',
      command: () => this.viewPlayerDetails(),
    },
    { separator: true },
    {
      label: 'Search on Dura',
      icon: 'pi pi-external-link',
      command: () => this.searchOnDura(),
    },
  ];

  ngOnInit(): void {
    this.toastService.info(
      'Right-click on a row to see more options',
      undefined,
      undefined,
      'bottom-right',
    );
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  protected onItemClick(item: PodiumListItem): void {
    const record = this.data().find((r) => r.name === item.id);
    if (record) this.navigateToPlayer(record);
  }

  protected onItemRightClick({ event, item }: { event: MouseEvent; item: PodiumListItem }): void {
    this.selectedRecord = this.data().find((r) => r.name === item.id) ?? null;
    this.cm()?.show(event);
  }

  protected onFilterChange(value: string): void {
    this.filterValue.set(value);
  }

  private toDisplayItem(record: OnlineTopRecord): PodiumListItem {
    const isDay = this.period() === 'day';
    const avgMinutes = isDay ? 0 : Math.round(record.online_time / Math.max(1, record.days_active));
    const dayWord = record.days_active === 1 ? 'day' : 'days';

    const columns: TextColumn[] = isDay
      ? [
          {
            type: 'text',
            label: 'Online Time',
            value: formatMinutesToHours(record.online_time),
            valueClass: this.metricTimeClass(record.online_time),
          },
        ]
      : [
          {
            type: 'text',
            label: 'Avg / Day',
            value: formatMinutesToHours(avgMinutes),
            valueClass: this.metricTimeClass(avgMinutes),
            subValue: formatMinutesToHours(record.online_time),
          },
          {
            type: 'text',
            label: 'Days Active',
            value: `${record.days_active} ${dayWord}`,
          },
        ];

    return {
      id: record.name,
      rank: record.rank,
      name: record.name,
      meta: `${record.vocation} · Lvl ${record.level}`,
      columns,
      rowClass: this.rowTimeClass(record),
      podiumClass: this.podiumTimeClass(record),
    };
  }

  private rowTimeClass(record: OnlineTopRecord): string {
    const avg = record.online_time / Math.max(1, record.days_active);
    if (avg >= DAILY_DANGER_MIN) return 'list-row--danger';
    if (avg >= DAILY_WARN_MIN) return 'list-row--warn';
    return '';
  }

  private metricTimeClass(minutes: number): string {
    if (minutes >= DAILY_DANGER_MIN) return 'metric--danger';
    if (minutes >= DAILY_WARN_MIN) return 'metric--warn';
    return '';
  }

  private podiumTimeClass(record: OnlineTopRecord): string {
    const avg = record.online_time / Math.max(1, record.days_active);
    if (avg >= DAILY_DANGER_MIN) return 'podium-base--danger';
    if (avg >= DAILY_WARN_MIN) return 'podium-base--warn';
    return '';
  }

  private navigateToPlayer(record: OnlineTopRecord): void {
    this.router.navigate(['/player', record.name], { queryParams: { section: 'experience' } });
  }

  private viewPlayerDetails(): void {
    if (this.selectedRecord) this.navigateToPlayer(this.selectedRecord);
  }

  private searchOnDura(): void {
    if (!this.selectedRecord) return;
    window.open(getDuraPlayerUrl(this.selectedRecord.name), '_blank', 'noopener,noreferrer');
  }
}
