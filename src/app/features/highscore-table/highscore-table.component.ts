import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageModule } from 'primeng/message';

import { HighscoreService } from '../../core/services/highscore.service';
import {
  HighscoreRecord,
  HighscoreSection,
  ScrapeDateRange,
  TimePeriod,
} from '../../core/models/highscore.model';
import { HighscoreHeaderComponent } from './highscore-header/highscore-header.component';
import { HighscoreFiltersComponent } from './highscore-filters/highscore-filters.component';
import { HighscoreDataTableComponent } from './highscore-data-table/highscore-data-table.component';

@Component({
  selector: 'app-highscore-table',
  templateUrl: './highscore-table.component.html',
  styleUrls: ['./highscore-table.component.scss'],
  imports: [
    MessageModule,
    HighscoreHeaderComponent,
    HighscoreFiltersComponent,
    HighscoreDataTableComponent,
  ],
})
export class HighscoreTableComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private highscoreService = inject(HighscoreService);

  dataTable = viewChild(HighscoreDataTableComponent);

  section = signal<HighscoreSection>('experience');
  selectedPeriod = signal<TimePeriod>('day');
  data = signal<HighscoreRecord[]>([]);
  scrapeDateRange = signal<ScrapeDateRange | null>(null);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  periodOptions = [
    { label: 'Day', value: 'day' as TimePeriod },
    { label: 'Week', value: 'week' as TimePeriod },
    { label: 'Month', value: 'month' as TimePeriod },
    { label: 'Year', value: 'year' as TimePeriod },
  ];

  async ngOnInit(): Promise<void> {
    await this.loadScrapeDateRange();

    this.route.params.subscribe((params) => {
      const section = params['section'] as HighscoreSection;
      if (section) {
        this.section.set(section);
        this.loadData();
      }
    });
  }

  async loadScrapeDateRange(): Promise<void> {
    const dateRange = await this.highscoreService.getMinMaxScrapeDates('highscore_top25');
    if (dateRange) {
      this.scrapeDateRange.set(dateRange);
      console.log('Data available from:', dateRange.min_date, 'to', dateRange.max_date);
    }
  }

  async loadData(): Promise<void> {
    const period = this.selectedPeriod();
    const section = this.section();

    this.data.set([]);
    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.highscoreService.getTopGainers({
        period,
        section,
        limit: 25,
      });

      if (result) {
        this.data.set(result);
      } else {
        this.error.set('Failed to load highscore data');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      this.error.set('An unexpected error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  onPeriodChange(period: TimePeriod): void {
    if (!period || typeof period !== 'string') return;
    if (period === this.selectedPeriod()) return;

    this.selectedPeriod.set(period);
    this.loadData();
  }

  onSearchChange(value: string): void {
    this.dataTable()?.filterGlobal(value);
  }

  getDateRangeForPeriod(): string[] {
    const dateRange = this.scrapeDateRange();
    if (!dateRange?.max_date) return [];

    const maxDate = new Date(dateRange.max_date);
    const period = this.selectedPeriod();
    const format = (date: Date) => date.toISOString().slice(0, 10);

    switch (period) {
      case 'day':
        return [format(maxDate)];
      case 'week': {
        const start = new Date(maxDate);
        start.setDate(maxDate.getDate() - 7);
        return [format(start), format(maxDate)];
      }
      case 'month': {
        const start = new Date(maxDate);
        start.setMonth(maxDate.getMonth() - 1);
        return [format(start), format(maxDate)];
      }
      case 'year': {
        const start = new Date(maxDate);
        start.setFullYear(maxDate.getFullYear() - 1);
        return [format(start), format(maxDate)];
      }
      default:
        return [];
    }
  }
}
