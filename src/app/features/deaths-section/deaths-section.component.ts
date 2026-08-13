import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

import { DeathRecord, ScrapeDateRange, TimePeriod } from '@core/models';
import { DeathsService, MetadataService, ServerService } from '@core/services';
import { createPeriodWindow, onServerSwitch } from '@shared/functions';
import { DateRangeLabelComponent } from '@shared/components/date-range-label/date-range-label.component';
import { ErrorStatusComponent } from '@shared/components/error-status/error-status.component';
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
    ErrorStatusComponent,
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
  error = signal<boolean>(false);
  loading = signal<boolean>(true);
  retrying = signal<boolean>(false);
  selectedPeriod = signal<TimePeriod>('day');
  pvpFilter = signal<boolean | null>(null);
  scrapeDateRange = signal<ScrapeDateRange | null>(null);
  private scrapeError = signal<boolean>(false);

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
      if (await this.loadScrapeDateRange()) {
        await this.loadData();
      }
    });
  }

  ngOnInit(): void {
    void (async () => {
      try {
        if (await this.loadScrapeDateRange()) {
          await this.loadData();
        }
      } catch {
        await this.loadData();
      }
    })();
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    void this.loadData();
  }

  onPvpFilterChange(filter: boolean | null): void {
    this.pvpFilter.set(filter);
    void this.loadData();
  }

  async retry(): Promise<void> {
    if (this.retrying()) return;
    this.retrying.set(true);
    try {
      if (await this.loadScrapeDateRange()) {
        await this.loadData();
      }
    } finally {
      this.retrying.set(false);
    }
  }

  private async loadScrapeDateRange(): Promise<boolean> {
    const result = await this.metadataService.getScrapeDates('deaths', false);
    if (result.status === 'error') {
      this.scrapeError.set(true);
      this.error.set(true);
      return false;
    }
    this.scrapeError.set(false);
    this.scrapeDateRange.set(result.range);
    return true;
  }

  async loadData(): Promise<void> {
    const requestId = ++this.dataRequestId;
    const window = this.window();
    if (!window) {
      this.error.set(this.scrapeError());
      this.loading.set(false);
      this.data.set([]);
      return;
    }

    this.error.set(false);
    this.loading.set(true);
    this.data.set([]);

    try {
      const result = await this.deathsService.getDeaths(
        {
          from: window.from,
          to: window.to,
          is_pvp: this.pvpFilter() ?? undefined,
        },
        false,
      );
      if (requestId !== this.dataRequestId) return;
      this.error.set(result === null);
      if (result) this.data.set(result);
    } finally {
      if (requestId === this.dataRequestId) {
        this.loading.set(false);
      }
    }
  }
}
