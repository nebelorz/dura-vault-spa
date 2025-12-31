import { Component, OnInit, signal, viewChild, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HighscoreRecord, HighscoreSection, ScrapeDateRange, TimePeriod } from '@core/models';
import { HighscoreService, MetadataService } from '@core/services';
import { calculateAvailableDataDateRange } from '@shared/functions';
import { HighscoreAvailableDataInfoComponent } from './highscore-available-data-info/highscore-available-data-info.component';
import { HighscoreDataTableComponent } from './highscore-data-table/highscore-data-table.component';
import { HighscoreFilterTableByNameComponent } from './highscore-filter-table-by-name/highscore-filter-table-by-name.component';
import { HighscoreHeaderComponent } from './highscore-header/highscore-header.component';
import { PeriodSelectorComponent } from '../../shared/period-selector/period-selector.component';

@Component({
  selector: 'app-highscore-table',
  templateUrl: './highscore-table.component.html',
  styleUrls: ['./highscore-table.component.scss'],
  imports: [
    HighscoreHeaderComponent,
    HighscoreFilterTableByNameComponent,
    PeriodSelectorComponent,
    HighscoreDataTableComponent,
    HighscoreAvailableDataInfoComponent,
  ],
})
export class HighscoreTableComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly highscoreService = inject(HighscoreService);
  private readonly metadataService = inject(MetadataService);

  // State
  data = signal<HighscoreRecord[]>([]);
  loading = signal<boolean>(true);
  scrapeDateRange = signal<ScrapeDateRange | null>(null);
  section = signal<HighscoreSection>('experience');
  selectedPeriod = signal<TimePeriod>('day');

  // Child
  private dataTable = viewChild(HighscoreDataTableComponent);

  // Computed date range for period
  dateRange = computed(() => {
    const period = this.selectedPeriod();
    const dateRange = this.scrapeDateRange();
    if (!dateRange?.max_date) return [];
    return calculateAvailableDataDateRange(period, dateRange.min_date ?? null, dateRange.max_date);
  });

  async ngOnInit(): Promise<void> {
    // Load metadata
    await this.loadScrapeDateRange();

    // Route changes
    this.route.params.subscribe((params) => {
      const section = params['section'] as HighscoreSection;
      if (section) {
        this.section.set(section);
        this.loadData();
      }
    });
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    this.loadData();
  }

  onSearchChange(value: string): void {
    this.dataTable()?.filterGlobal(value);
  }

  private async loadScrapeDateRange(): Promise<void> {
    try {
      const dateRange = await this.metadataService.getMinMaxScrapeDates('highscore_top');
      if (dateRange) {
        this.scrapeDateRange.set(dateRange);
      }
    } catch (error) {
      console.error('Error loading scrape date range:', error);
    }
  }

  private async loadData(): Promise<void> {
    this.loading.set(true);
    this.data.set([]);

    try {
      const result = await this.highscoreService.getTopGainers({
        period: this.selectedPeriod(),
        section: this.section(),
        limit: 100,
      });

      if (result) {
        this.data.set(result);
      }
    } catch (error) {
      console.error('Error loading highscore data:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
