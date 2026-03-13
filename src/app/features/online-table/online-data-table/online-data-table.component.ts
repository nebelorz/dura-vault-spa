import { Component, computed, input, inject, viewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env';

import { OnlineTopRecord, TimePeriod } from '@core/models';
import { ToastService } from '@core/services';
import { MinutesToHoursPipe } from '@shared/pipes';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

const DAILY_WARN_MIN = 600; // 10 h
const DAILY_DANGER_MIN = 840; // 14 h

@Component({
  selector: 'app-online-data-table',
  templateUrl: './online-data-table.component.html',
  styleUrls: ['./online-data-table.component.scss'],
  imports: [ContextMenuModule, MinutesToHoursPipe, LoadingStatusComponent, NoDataStatusComponent],
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

  // Childs
  private readonly cm = viewChild<ContextMenu>('cm');

  // Computed
  readonly topThree = computed(() => this.data().slice(0, 3));
  readonly restOfList = computed(() => this.data().slice(3));
  readonly showAvg = computed(() => this.period() !== 'day'); // Avg/day is only meaningful for multi-day periods

  avgPerDay(record: OnlineTopRecord): number {
    return Math.round(record.online_time / Math.max(1, record.days_active));
  }

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
      icon: 'pi pi-search',
      command: () => this.searchOnDura(),
    },
    {
      label: 'Copy',
      icon: 'pi pi-copy',
      command: () => this.copyPlayerInfo(),
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

  rowTimeClass(record: OnlineTopRecord): string {
    const avg = record.online_time / Math.max(1, record.days_active);
    if (avg >= DAILY_DANGER_MIN) return 'list-row--danger';
    if (avg >= DAILY_WARN_MIN) return 'list-row--warn';
    return '';
  }

  navigateToPlayer(record: OnlineTopRecord): void {
    this.router.navigate(['/player', record.name], { queryParams: { section: 'experience' } });
  }

  onRightClick(event: MouseEvent, record: OnlineTopRecord): void {
    this.selectedRecord = record;
    this.cm()?.show(event);
    event.preventDefault();
  }

  private viewPlayerDetails(): void {
    const record = this.selectedRecord;
    if (!record) return;
    this.router.navigate(['/player', record.name], { queryParams: { section: 'experience' } });
  }

  private searchOnDura(): void {
    const record = this.selectedRecord;
    if (!record) return;
    const url = `${environment.dura.baseURL}/?characters/${record.name}`;
    window.open(url, '_blank');
  }

  private async copyPlayerInfo(): Promise<void> {
    const record = this.selectedRecord;
    if (!record) return;
    try {
      await navigator.clipboard.writeText(this.formatPlayerInfo(record));
    } catch {
      this.toastService.error('Failed to copy to clipboard.');
    }
  }

  private formatPlayerInfo(record: OnlineTopRecord): string {
    const pipe = new MinutesToHoursPipe();
    return [
      `Name: ${record.name}`,
      `Vocation: ${record.vocation}`,
      `Level: ${record.level}`,
      `Online Time: ${pipe.transform(record.online_time)}`,
      `Avg/day: ${pipe.transform(record.days_active > 1 ? Math.round(record.online_time / record.days_active) : null)}`,
      `Active days: ${record.days_active}`,
      `First seen: ${record.first_seen}`,
      `Last seen: ${record.last_seen}`,
    ].join(' | ');
  }
}
