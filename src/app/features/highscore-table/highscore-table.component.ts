import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { HighscoreService } from '../../core/services/highscore.service';
import { HighscoreRecord, HighscoreSection, TimePeriod } from '../../core/models/highscore.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-highscore-table',
  templateUrl: './highscore-table.component.html',
  styleUrls: ['./highscore-table.component.scss'],
  imports: [
    ButtonModule,
    CommonModule,
    FloatLabel,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    LoadingSpinnerComponent,
    MessageModule,
    SelectButtonModule,
    TableModule,
    TooltipModule,
  ],
})
export class HighscoreTableComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private highscoreService = inject(HighscoreService);

  dt = viewChild<Table>('dt');

  section = signal<string>('experience');
  selectedPeriod = signal<TimePeriod>('day');
  selectedPeriodValue: TimePeriod = 'day'; // ngModel binding
  data = signal<HighscoreRecord[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  periodOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const section = params['section'];
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
      const result = await this.highscoreService.getHighscores(period, section as HighscoreSection);

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
    if (!period || typeof period !== 'string') {
      this.selectedPeriodValue = this.selectedPeriod();
      return;
    }

    // Prevents duplicate calls for same period
    if (period === this.selectedPeriod()) return;

    this.selectedPeriodValue = period;
    this.selectedPeriod.set(period);
    this.loadData();
  }

  onFilterGlobal(value: string): void {
    this.dt()?.filterGlobal(value, 'contains');
  }

  refreshData(): void {
    const period = this.selectedPeriod();
    const section = this.section();
    const storeKey = `${section}_${period}`;

    // Clear stored data
    this.highscoreService.clearDataByPattern(storeKey);
    this.loadData();
  }

  formatPoints(points: number | null): string {
    if (points === null || points === undefined) {
      return '-';
    }
    return points.toLocaleString('en-US');
  }

  formatGain(gain: number | null): string {
    if (gain === null || gain === undefined) {
      return '-';
    }
    return gain > 0 ? `+${gain.toLocaleString('en-US')}` : gain.toLocaleString('en-US');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
