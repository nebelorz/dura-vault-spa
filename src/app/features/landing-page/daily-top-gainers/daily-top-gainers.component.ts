import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DailyHighscoresSummary, DailyTopPlayer, SectionData } from '@core/models';
import { HighscoreService, MetadataService } from '@core/services';
import { HIGHSCORE_SECTIONS } from '@core/constants';
import { AbbreviateNumberPipe } from '@shared/pipes';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

import { CarouselModule } from 'primeng/carousel';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-daily-top-gainers',
  templateUrl: './daily-top-gainers.component.html',
  styleUrls: ['./daily-top-gainers.component.scss'],
  imports: [
    CommonModule,
    CarouselModule,
    AbbreviateNumberPipe,
    Tooltip,
    LoadingStatusComponent,
    NoDataStatusComponent,
  ],
})
export class DailyTopGainersComponent implements OnInit {
  private highscoreService = inject(HighscoreService);
  private metadataService = inject(MetadataService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  maxDate = signal<string | null>(null);
  experiencePlayers = signal<DailyTopPlayer[]>([]);
  otherSections = signal<SectionData[]>([]);

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadDailySummary(), this.loadMaxDate()]);
  }

  navigateToPlayer(playerName: string, section: string): void {
    this.router.navigate(['/player', playerName], {
      queryParams: { section },
    });
  }

  private async loadMaxDate(): Promise<void> {
    const dateRange = await this.metadataService.getMinMaxScrapeDates('highscore_top', false);
    if (dateRange?.max_date) {
      this.maxDate.set(dateRange.max_date);
    }
  }

  private async loadDailySummary(): Promise<void> {
    this.loading.set(true);

    try {
      const summary = await this.highscoreService.getDailyHighscoresSummary(true);
      if (summary) {
        this.processSummaryData(summary);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private processSummaryData(summary: DailyHighscoresSummary): void {
    this.experiencePlayers.set(summary.top_daily.experience?.slice(0, 3) || []);

    const sections = HIGHSCORE_SECTIONS.filter((s) => s.value !== 'experience')
      .map((section) => ({
        name: section.value,
        label: section.label,
        players:
          (
            summary.top_daily[section.value as keyof typeof summary.top_daily] as
              | DailyTopPlayer[]
              | undefined
          )?.slice(0, 1) || [],
      }))
      .filter((s) => s.players.length > 0);

    this.otherSections.set(sections);
  }
}
