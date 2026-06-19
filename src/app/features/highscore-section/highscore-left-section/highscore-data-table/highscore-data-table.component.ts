import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  inject,
  viewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import { HighscoreRecord, PodiumListItem, Section } from '@core/models';
import { ToastService } from '@core/services';
import { getDuraPlayerUrl, buildMetrics } from '@shared/functions';
import {
  PlayerListComponent,
  LoadingStatusComponent,
  NoDataStatusComponent,
} from '@shared/components';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-data-table',
  templateUrl: './highscore-data-table.component.html',
  styleUrl: './highscore-data-table.component.scss',
  host: { '[class.podium-danger-mode]': 'isLoss()' },
  imports: [ContextMenuModule, PlayerListComponent, LoadingStatusComponent, NoDataStatusComponent],
})
export class HighscoreDataTableComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  // Inputs
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  // State
  private selectedRecord: HighscoreRecord | null = null;

  // Child
  private readonly cm = viewChild<ContextMenu>('cm');

  // Computed
  protected readonly isLoss = computed(() => this.section() === 'experience_loss');

  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.data().map((record) => this.toDisplayItem(record, this.section())),
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
    if (record) this.navigateToRecord(record);
  }

  protected onItemRightClick({ event, item }: { event: MouseEvent; item: PodiumListItem }): void {
    this.selectedRecord = this.data().find((r) => r.name === item.id) ?? null;
    this.cm()?.show(event);
  }

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

  private navigateToRecord(record: HighscoreRecord): void {
    const section = record.section === 'experience_loss' ? 'experience' : record.section;
    this.router.navigate(['/player', record.name], { queryParams: { section } });
  }

  private viewPlayerDetails(): void {
    if (this.selectedRecord) this.navigateToRecord(this.selectedRecord);
  }

  private searchOnDura(): void {
    const record = this.selectedRecord;
    if (!record) return;
    window.open(getDuraPlayerUrl(record.name), '_blank');
  }
}
