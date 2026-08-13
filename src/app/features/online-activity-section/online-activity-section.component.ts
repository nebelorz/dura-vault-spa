import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { OnlineTimelineRecord, OnlineTopRecord, ScrapeDateRange, TimePeriod } from '@core/models';
import { MetadataService, OnlineService, ServerService } from '@core/services';
import { createPeriodWindow, onServerSwitch } from '@shared/functions';
import { DateRangeLabelComponent } from '@shared/components/date-range-label/date-range-label.component';
import { ErrorStatusComponent } from '@shared/components/error-status/error-status.component';
import { PeriodSelectorComponent } from '@shared/components/period-selector/period-selector.component';
import { OnlineHeaderComponent } from './online-header/online-header.component';
import { OnlineDataTableComponent } from './online-activity-left-section/online-activity-data-table/online-activity-data-table.component';
import { OnlineActivityChartsComponent } from './online-activity-right-section/online-activity-charts/online-activity-charts.component';

@Component({
  selector: 'app-online-activity-section',
  templateUrl: './online-activity-section.component.html',
  imports: [
    OnlineHeaderComponent,
    PeriodSelectorComponent,
    DateRangeLabelComponent,
    ErrorStatusComponent,
    OnlineDataTableComponent,
    OnlineActivityChartsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineActivitySectionComponent implements OnInit {
  private readonly onlineService = inject(OnlineService);
  private readonly metadataService = inject(MetadataService);
  private readonly serverService = inject(ServerService);

  // State
  data = signal<OnlineTopRecord[]>([]);
  timeline = signal<OnlineTimelineRecord[]>([]);
  topError = signal<boolean>(false);
  timelineError = signal<boolean>(false);
  loading = signal<boolean>(true);
  selectedPeriod = signal<TimePeriod>('day');
  scrapeDateRange = signal<ScrapeDateRange | null>(null);
  scrapeError = signal<boolean>(false);
  retrying = signal<boolean>(false);

  private dataRequestId = 0;

  // Single period window shared by the data requests and the label
  private readonly periodWindow = createPeriodWindow(this.selectedPeriod, this.scrapeDateRange);
  window = this.periodWindow.window;
  dateRange = this.periodWindow.dateRange;

  constructor() {
    onServerSwitch(this.serverService, async () => {
      if (await this.loadScrapeDateRange()) {
        await this.loadData();
      }
    });
  }

  ngOnInit(): void {
    void this.loadScrapeDateRange().then((ok) => {
      if (ok) return this.loadData();
      return Promise.resolve();
    });
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
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
    const result = await this.metadataService.getScrapeDates('online_top', false);
    if (result.status === 'error') {
      this.scrapeError.set(true);
      this.loading.set(false);
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
      this.topError.set(this.scrapeError());
      this.timelineError.set(this.scrapeError());
      this.loading.set(false);
      this.data.set([]);
      this.timeline.set([]);
      return;
    }

    this.scrapeError.set(false);
    this.topError.set(false);
    this.timelineError.set(false);
    this.loading.set(true);
    this.data.set([]);
    this.timeline.set([]);

    try {
      const [topResult, timelineResult] = await Promise.all([
        this.onlineService.getTopOnline(
          {
            from: window.from,
            to: window.to,
          },
          false,
        ),
        this.onlineService.getOnlineTimeline(window.from, window.to),
      ]);

      if (requestId !== this.dataRequestId) return;
      this.topError.set(topResult === null);
      this.timelineError.set(timelineResult === null);
      if (topResult) {
        this.data.set(topResult);
      }
      if (timelineResult) {
        this.timeline.set(timelineResult);
      }
    } finally {
      if (requestId === this.dataRequestId) {
        this.loading.set(false);
      }
    }
  }
}
