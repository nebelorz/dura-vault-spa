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

import { DeathRecord, PodiumListItem } from '@core/models';
import { ServerService, ToastService } from '@core/services';
import { getDuraPlayerUrl } from '@shared/functions';
import {
  PlayerListComponent,
  LoadingStatusComponent,
  NoDataStatusComponent,
} from '@shared/components';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-deaths-data-table',
  templateUrl: './deaths-data-table.component.html',
  styleUrl: './deaths-data-table.component.scss',
  imports: [
    ContextMenuModule,
    PlayerListComponent,
    LoadingStatusComponent,
    NoDataStatusComponent,
  ],
})
export class DeathsDataTableComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly serverService = inject(ServerService);
  private readonly toastService = inject(ToastService);

  // Inputs
  data = input.required<DeathRecord[]>();
  loading = input.required<boolean>();
  // State
  private selectedRecord: DeathRecord | null = null;

  // Child
  private readonly cm = viewChild<ContextMenu>('cm');

  // Computed
  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.data().map((record, index) => this.toDisplayItem(record, index)),
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
    const record = this.data().find((r) => String(r.id) === item.id);
    if (record) this.navigateToPlayer(record);
  }

  protected onItemRightClick({ event, item }: { event: MouseEvent; item: PodiumListItem }): void {
    this.selectedRecord = this.data().find((r) => String(r.id) === item.id) ?? null;
    this.cm()?.show(event);
  }

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
          valueTooltip: record.is_pvp ? 'Player killer' : 'Monster killer',
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
      rowClass: record.is_pvp ? 'list-row--pvp' : 'list-row--pve',
      badge: {
        text: record.is_pvp ? 'PvP' : 'PvE',
        class: record.is_pvp ? 'badge--danger' : 'badge--warn',
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

  private navigateToPlayer(record: DeathRecord): void {
    this.router.navigate(['/player', record.player_name], {
      queryParams: { section: 'experience' },
    });
  }

  private viewPlayerDetails(): void {
    if (this.selectedRecord) this.navigateToPlayer(this.selectedRecord);
  }

  private searchOnDura(): void {
    if (!this.selectedRecord) return;
    window.open(
      getDuraPlayerUrl(this.selectedRecord.player_name, this.serverService.server()),
      '_blank',
      'noopener,noreferrer',
    );
  }
}
