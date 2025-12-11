import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageModule } from 'primeng/message';

import { HighscoreService } from '../../core/services/highscore.service';
import { HighscoreRecord, HighscoreSection, TimePeriod } from '../../core/models/highscore.model';
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
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  periodOptions = [
    { label: 'Day', value: 'day' as TimePeriod },
    { label: 'Week', value: 'week' as TimePeriod },
    { label: 'Month', value: 'month' as TimePeriod },
    { label: 'Year', value: 'year' as TimePeriod },
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const section = params['section'] as HighscoreSection;
      if (section) {
        this.section.set(section);
        this.loadData();
      }
    });
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

  refreshData(): void {
    const period = this.selectedPeriod();
    const section = this.section();
    const storeKey = `top_gainers_${period}_${section}`;

    this.highscoreService.clearDataByPattern(storeKey);
    this.loadData();
  }

  getDateRange(): string[] {
    const period = this.selectedPeriod();
    const today = new Date();
    const format = (date: Date) => date.toISOString().slice(0, 10);

    switch (period) {
      case 'day':
        return [format(today)];
      case 'week': {
        const start = new Date(today);
        start.setDate(today.getDate() - 7);
        return [format(start), format(today)];
      }
      case 'month': {
        const start = new Date(today);
        start.setMonth(today.getMonth() - 1);
        return [format(start), format(today)];
      }
      case 'year': {
        const start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        return [format(start), format(today)];
      }
      default:
        return [];
    }
  }
}
