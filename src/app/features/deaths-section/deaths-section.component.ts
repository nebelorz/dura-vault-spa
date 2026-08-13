import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

import { DeathRecord, ScrapeDateRange, TimePeriod } from '@core/models';
import { DeathsService, MetadataService, ServerService } from '@core/services';
import { createPeriodWindow, onServerSwitch } from '@shared/functions';
import { DateRangeLabelComponent } from '@shared/components/date-range-label/date-range-label.component';
import { PeriodSelectorComponent } from '@shared/components/period-selector/period-selector.component';
import { DeathsHeaderComponent } from './deaths-header/deaths-header.component';
import { DeathsDataTableComponent } from './deaths-left-section/deaths-data-table/deaths-data-table.component';
import { DeathsChartsComponent } from './deaths-right-section/deaths-charts/deaths-charts.component';

@Component({
  selector: 'app-deaths-section',
  templateUrl: './deaths-section.component.html',
  styleUrl: './deaths-section.component.scss',
  imports: [
    DeathsHeaderComponent,
    PeriodSelectorComponent,
    DateRangeLabelComponent,
    DeathsDataTableComponent,
    DeathsChartsComponent,
    SelectButtonModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeathsSectionComponent implements OnInit {
  private readonly deathsService = inject(DeathsService);
  private readonly metadataService = inject(MetadataService);
  private readonly serverService = inject(ServerService);

  data = signal<DeathRecord[]>([]);
  loading = signal<boolean>(true);
  selectedPeriod = signal<TimePeriod>('day');
  pvpFilter = signal<boolean | null>(null);
  scrapeDateRange = signal<ScrapeDateRange | null>(null);

  private dataRequestId = 0;

  // Single period window shared by the data requests and the label
  private readonly periodWindow = createPeriodWindow(this.selectedPeriod, this.scrapeDateRange);
  window = this.periodWindow.window;
  dateRange = this.periodWindow.dateRange;

  protected readonly pvpFilterOptions = [
    { label: 'All', value: null },
    { label: 'PvP', value: true },
    { label: 'PvE', value: false },
  ];

  constructor() {
    onServerSwitch(this.serverService, async () => {
      this.pvpFilter.set(null);
      await this.loadScrapeDateRange();
      await this.loadData();
    });
  }

  ngOnInit(): void {
    this.loadScrapeDateRange()
      .then(() => this.loadData())
      .catch(() => this.loadData());
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    void this.loadData();
  }

  onPvpFilterChange(filter: boolean | null): void {
    this.pvpFilter.set(filter);
    void this.loadData();
  }

  private async loadScrapeDateRange(): Promise<void> {
    const dateRange = await this.metadataService.getScrapeDates('deaths', false);
    if (dateRange) this.scrapeDateRange.set(dateRange);
  }

  private async loadData(): Promise<void> {
    const requestId = ++this.dataRequestId;
    const window = this.window();
    if (!window) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.data.set([]);

    try {
      const result = await this.deathsService.getDeaths({
        from: window.from,
        to: window.to,
        is_pvp: this.pvpFilter() ?? undefined,
      });
      if (requestId !== this.dataRequestId) return;
      if (result) this.data.set(result);
    } finally {
      if (requestId === this.dataRequestId) {
        this.loading.set(false);
      }
    }
  }
}
