import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

import { DeathRecord, ScrapeDateRange, TimePeriod } from '@core/models';
import { DeathsService, MetadataService, ServerService } from '@core/services';
import { calculateAvailableDataDateRange } from '@shared/functions';
import { onServerSwitch } from '@shared/functions';
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
    DeathsDataTableComponent,
    DeathsChartsComponent,
    DatePipe,
    SelectButtonModule,
    FormsModule,
  ],
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

  protected readonly pvpFilterOptions = [
    { label: 'All', value: null },
    { label: 'PvP', value: true },
    { label: 'PvE', value: false },
  ];

  constructor() {
    onServerSwitch(this.serverService, () => {
      this.pvpFilter.set(null);
      void this.loadScrapeDateRange();
      void this.loadData();
    });
  }

  dateRange = computed<string[]>(() => {
    const range = this.scrapeDateRange();
    if (!range?.active_comparison_date) return [];
    return calculateAvailableDataDateRange(
      this.selectedPeriod(),
      range.min_scrape_date ?? null,
      range.active_comparison_date,
    );
  });

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
    this.loading.set(true);
    this.data.set([]);

    try {
      const result = await this.deathsService.getDeaths({
        period: this.selectedPeriod(),
        is_pvp: this.pvpFilter() ?? undefined,
        limit: 500,
      });
      if (result) this.data.set(result);
    } finally {
      this.loading.set(false);
    }
  }
}
