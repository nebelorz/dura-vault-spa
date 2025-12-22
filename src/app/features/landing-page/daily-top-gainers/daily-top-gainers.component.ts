import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbbreviateNumberPipe } from '../../../shared/pipes/abbreviate-number.pipe';
import { DailyHighscoresSummary, DailyTopPlayer } from '../../../core/models/highscore.model';
import { HighscoreService } from '../../../core/services/highscore.service';
import { MetadataService } from '../../../core/services/metadata.service';

import { CarouselModule } from 'primeng/carousel';
import { Tooltip } from 'primeng/tooltip';

interface SectionData {
  name: string;
  label: string;
  players: DailyTopPlayer[];
}

@Component({
  selector: 'app-daily-top-gainers',
  templateUrl: './daily-top-gainers.component.html',
  styleUrls: ['./daily-top-gainers.component.scss'],
  imports: [CommonModule, CarouselModule, AbbreviateNumberPipe, Tooltip],
})
export class DailyTopGainersComponent implements OnInit {
  private highscoreService = inject(HighscoreService);
  private metadataService = inject(MetadataService);

  loading = signal<boolean>(false);
  maxDate = signal<string | null>(null);
  experiencePlayers = signal<DailyTopPlayer[]>([]);
  otherSections = signal<SectionData[]>([]);

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadDailySummary(), this.loadMaxDate()]);
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

    const skillConfigs = [
      { name: 'magic', label: 'Magic' },
      { name: 'fist', label: 'Fist' },
      { name: 'club', label: 'Club' },
      { name: 'sword', label: 'Sword' },
      { name: 'axe', label: 'Axe' },
      { name: 'distance', label: 'Distance' },
      { name: 'shield', label: 'Shield' },
      { name: 'fishing', label: 'Fishing' },
    ];

    const sections = skillConfigs
      .map(({ name, label }) => ({
        name,
        label,
        players:
          (
            summary.top_daily[name as keyof typeof summary.top_daily] as
              | DailyTopPlayer[]
              | undefined
          )?.slice(0, 1) || [],
      }))
      .filter((s) => s.players.length > 0);

    this.otherSections.set(sections);
  }
}
