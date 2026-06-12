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
import {
  getDuraPlayerUrl,
  getMetricGainOrLossTooltip,
  getMetricPercentageOfTotalEXP,
  getMetricTooltip,
} from '@shared/functions';
import { MetricColumn, PodiumListComponent, PodiumListItem } from '@shared/components';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-data-table',
  templateUrl: './highscore-data-table.component.html',
  styleUrl: './highscore-data-table.component.scss',
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

  private toDisplayItem(record: HighscoreRecord, section: Section): PodiumListItem {
    const isExperience = section === 'experience' || section === 'experience_loss';

    let columns: MetricColumn[];

    if (isExperience) {
      columns = [
        {
          type: 'metric',
          metric: 'experience',
          value: record.gain_points ?? 0,
          abbreviate: true,
          valueTooltip: getMetricGainOrLossTooltip('experience', record.gain_points < 0),
          relativePercentagePointsFromTotal: record.points ?? undefined,
          subValueTooltip: getMetricPercentageOfTotalEXP(),
        },
        {
          type: 'metric',
          metric: 'level',
          value: record.gain_level,
          abbreviate: false,
          valueTooltip: getMetricGainOrLossTooltip('level', record.gain_level < 0),
          subValue: `${record.level}`,
          subValueTooltip: getMetricTooltip('level'),
        },
        {
          type: 'metric',
          metric: 'rank',
          value: record.gain_rank,
          abbreviate: false,
          valueTooltip: getMetricGainOrLossTooltip('rank', record.gain_rank < 0),
          subValue: `#${record.rank}`,
          subValueTooltip: getMetricTooltip('rank'),
        },
      ];
    } else {
      columns = [
        {
          type: 'metric',
          metric: 'skill',
          value: record.gain_level,
          abbreviate: false,
          valueTooltip: getMetricGainOrLossTooltip('skill', record.gain_level < 0),
          subValue: `${record.level}`,
          subValueTooltip: getMetricTooltip('skill'),
        },
        {
          type: 'metric',
          metric: 'rank',
          value: record.gain_rank,
          abbreviate: false,
          valueTooltip: getMetricGainOrLossTooltip('rank', record.gain_rank < 0),
          subValue: `#${record.rank}`,
          subValueTooltip: getMetricTooltip('rank'),
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
