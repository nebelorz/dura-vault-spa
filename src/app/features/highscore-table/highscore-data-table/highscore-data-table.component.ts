import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  inject,
  viewChild,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import { HighscoreRecord, Section } from '@core/models';
import { ToastService } from '@core/services';
import { getSectionLabel } from '@core/constants';
import { formatNumber, getDuraPlayerUrl } from '@shared/functions';
import { PodiumListComponent, PodiumListItem, ListColumn } from '@shared/components';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

function gainWord(n: number, singular: string, plural: string): string {
  return Math.abs(n) === 1 ? singular : plural;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-data-table',
  templateUrl: './highscore-data-table.component.html',
  styleUrls: ['./highscore-data-table.component.scss'],
  host: { '[class.podium-danger-mode]': 'isLoss()' },
  imports: [ContextMenuModule, PodiumListComponent],
})
export class HighscoreDataTableComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  // Inputs
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  // State
  private readonly filterValue = signal<string>('');
  private selectedRecord: HighscoreRecord | null = null;

  // Child
  private readonly cm = viewChild<ContextMenu>('cm');

  // Computed
  private readonly trimmedFilter = computed(() => this.filterValue().trim());
  readonly hasFilter = computed(() => this.trimmedFilter().length > 0);
  private readonly filteredData = computed(() => {
    const filter = this.trimmedFilter().toLowerCase();
    if (!filter) return this.data();
    return this.data().filter((r) => r.name.toLowerCase().includes(filter));
  });

  protected readonly isLoss = computed(() => this.section() === 'experience_loss');

  readonly displayItems = computed<PodiumListItem[]>(() =>
    this.filteredData().map((record) => this.toDisplayItem(record, this.section())),
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
      icon: 'pi pi-search',
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

  protected onFilterChange(value: string): void {
    this.filterValue.set(value);
  }

  protected onItemClick(item: PodiumListItem): void {
    const record = this.data().find((r) => r.name === item.id);
    if (record) this.navigateToRecord(record);
  }

  protected onItemRightClick({ event, item }: { event: MouseEvent; item: PodiumListItem }): void {
    this.selectedRecord = this.data().find((r) => r.name === item.id) ?? null;
    this.cm()?.show(event);
  }

  private gainClass(value: number, positiveClass: string): string {
    if (value > 0) return positiveClass;
    if (value < 0) return 'metric--danger';
    return '';
  }

  private toDisplayItem(record: HighscoreRecord, section: Section): PodiumListItem {
    const isExperience = section === 'experience' || section === 'experience_loss';
    const isLoss = section === 'experience_loss';

    let columns: ListColumn[];

    if (isExperience) {
      const gainPoints = record.gain_points ?? 0;
      const xpFormatted = `${formatNumber(gainPoints)} XP`;
      const xpPercent =
        record.points && record.points > 0
          ? `${((gainPoints / record.points) * 100).toFixed(2)}%`
          : undefined;
      const xpClass = this.gainClass(gainPoints, isLoss ? '' : 'metric--xp');

      columns = [
        {
          label: isLoss ? 'Exp Lost' : 'Exp Gained',
          value: xpFormatted,
          valueClass: xpClass,
          subValue: xpPercent,
          subValueClass: xpClass,
        },
        {
          label: isLoss ? 'Levels Lost' : 'Levels Gained',
          value: `${record.gain_level}`,
          podiumValue: `${record.gain_level} ${gainWord(record.gain_level, 'LEVEL', 'LEVELS')}`,
          valueClass: this.gainClass(record.gain_level, 'metric--skill'),
          subValue: `Lvl ${record.level}`,
        },
        {
          label: isLoss ? 'Rank Lost' : 'Rank Gained',
          value: `${record.gain_rank}`,
          podiumValue: `${record.gain_rank} ${gainWord(record.gain_rank, 'RANK', 'RANKS')}`,
          valueClass: this.gainClass(record.gain_rank, 'metric--rank'),
          subValue: `#${record.rank}`,
          subValueClass: 'metric--rank',
        },
      ];
    } else {
      columns = [
        {
          label: 'Skill Gained',
          value: `${record.gain_level}`,
          podiumValue: `${record.gain_level} ${getSectionLabel(section)}`,
          valueClass: this.gainClass(record.gain_level, 'metric--skill'),
          subValue: `${getSectionLabel(section)} ${record.level}`,
        },
        {
          label: 'Rank Gained',
          value: `${record.gain_rank}`,
          podiumValue: `${record.gain_rank} ${gainWord(record.gain_rank, 'RANK', 'RANKS')}`,
          valueClass: this.gainClass(record.gain_rank, 'metric--rank'),
          subValue: `#${record.rank}`,
          subValueClass: 'metric--rank',
        },
      ];
    }

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
