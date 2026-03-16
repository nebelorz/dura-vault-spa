import { Component, OnInit, signal, inject, computed } from '@angular/core';

import { OnlineTimelineRecord, OnlineTopRecord, ScrapeDateRange, TimePeriod } from '@core/models';
import { MetadataService, OnlineService } from '@core/services';
import { calculateAvailableDataDateRange } from '@shared/functions';
import { PeriodSelectorComponent } from '@shared/components/period-selector/period-selector.component';
import { OnlineHeaderComponent } from './online-header/online-header.component';
import { OnlineDataTableComponent } from './online-data-table/online-data-table.component';
import { OnlineStatsComponent } from './online-stats/online-stats.component';

@Component({
  selector: 'app-online-table',
  templateUrl: './online-table.component.html',
  styleUrls: ['./online-table.component.scss'],
  imports: [
    OnlineHeaderComponent,
    PeriodSelectorComponent,
    OnlineDataTableComponent,
    OnlineStatsComponent,
  ],
})
export class OnlineTableComponent implements OnInit {
  private readonly onlineService = inject(OnlineService);
  private readonly metadataService = inject(MetadataService);

  // State
  data = signal<OnlineTopRecord[]>([]);
  timeline = signal<OnlineTimelineRecord[]>([]);
  loading = signal<boolean>(true);
  selectedPeriod = signal<TimePeriod>('day');
  scrapeDateRange = signal<ScrapeDateRange | null>(null);

  // Computed
  dateRange = computed<string[]>(() => {
    const range = this.scrapeDateRange();
    if (!range?.active_comparison_date) return [];
    return calculateAvailableDataDateRange(
      this.selectedPeriod(),
      range.min_scrape_date ?? null,
      range.active_comparison_date,
    );
  });

  async ngOnInit(): Promise<void> {
    await this.loadScrapeDateRange();
    await this.loadData();
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    this.loadData();
  }

  private async loadScrapeDateRange(): Promise<void> {
    const dateRange = await this.metadataService.getScrapeDates('online_top', false);
    if (dateRange) this.scrapeDateRange.set(dateRange);
  }

  private async loadData(): Promise<void> {
    this.loading.set(true);
    this.data.set([]);
    this.timeline.set([]);

    try {
      const [topResult, timelineResult] = await Promise.all([
        this.onlineService.getTopOnline({ period: this.selectedPeriod(), limit: 100 }),
        this.onlineService.getOnlineTimeline(this.selectedPeriod()),
      ]);

      if (topResult) {
        this.data.set(topResult);
      }
      if (timelineResult) {
        this.timeline.set(timelineResult);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
