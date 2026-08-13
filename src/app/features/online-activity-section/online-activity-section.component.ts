import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { OnlineTimelineRecord, OnlineTopRecord, ScrapeDateRange, TimePeriod } from '@core/models';
import { MetadataService, OnlineService, ServerService } from '@core/services';
import { createPeriodWindow, onServerSwitch } from '@shared/functions';
import { DateRangeLabelComponent } from '@shared/components/date-range-label/date-range-label.component';
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
  loading = signal<boolean>(true);
  selectedPeriod = signal<TimePeriod>('day');
  scrapeDateRange = signal<ScrapeDateRange | null>(null);

  private dataRequestId = 0;

  // Single period window shared by the data requests and the label
  private readonly periodWindow = createPeriodWindow(this.selectedPeriod, this.scrapeDateRange);
  window = this.periodWindow.window;
  dateRange = this.periodWindow.dateRange;

  constructor() {
    onServerSwitch(this.serverService, async () => {
      await this.loadScrapeDateRange();
      await this.loadData();
    });
  }

  ngOnInit(): void {
    void this.loadScrapeDateRange().then(() => this.loadData());
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    void this.loadData();
  }

  private async loadScrapeDateRange(): Promise<void> {
    const dateRange = await this.metadataService.getScrapeDates('online_top', false);
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
    this.timeline.set([]);

    try {
      const [topResult, timelineResult] = await Promise.all([
        this.onlineService.getTopOnline({
          from: window.from,
          to: window.to,
        }),
        this.onlineService.getOnlineTimeline(window.from, window.to),
      ]);

      if (requestId !== this.dataRequestId) return;
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
