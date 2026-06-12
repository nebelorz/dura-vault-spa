import { Component, inject, OnInit, signal } from '@angular/core';

import { DailyHighscoresSummary, DailyTopPlayer, SectionData } from '@core/models';
import { HighscoreService, MetadataService, ThemeService } from '@core/services';
import { HIGHSCORE_SECTIONS } from '@core/constants';
import { DailyTopGainersComponent } from './daily-top-gainers/daily-top-gainers.component';
import { DevInfoPanelComponent } from './dev-info-panel/dev-info-panel.component';
import { AnnouncementCarouselComponent } from './announcement-carousel/announcement-carousel.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  imports: [
    AnnouncementCarouselComponent,
    DevInfoPanelComponent,
    DailyTopGainersComponent,
    SideMenuComponent,
  ],
})
export class LandingPageComponent implements OnInit {
  private readonly highscoreService = inject(HighscoreService);
  private readonly metadataService = inject(MetadataService);

  protected readonly darkMode = inject(ThemeService).darkMode;

  // State
  protected readonly loading = signal<boolean>(false);
  protected readonly maxDate = signal<string | null>(null);
  protected readonly experiencePlayers = signal<DailyTopPlayer[]>([]);
  protected readonly experienceLossPlayer = signal<DailyTopPlayer | null>(null);
  protected readonly skillsSection = signal<SectionData[]>([]);

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadDailySummary(), this.loadActiveComparisonDate()]);
  }

  private async loadActiveComparisonDate(): Promise<void> {
    const dateRange = await this.metadataService.getScrapeDates('highscore_top', false);
    if (dateRange?.active_comparison_date) {
      this.maxDate.set(dateRange.active_comparison_date);
    }
  }

  private async loadDailySummary(): Promise<void> {
    this.loading.set(true);
    try {
      const summary = await this.highscoreService.getDailyHighscoresSummary(true);
      if (summary) this.processSummaryData(summary);
    } finally {
      this.loading.set(false);
    }
  }

  private processSummaryData(summary: DailyHighscoresSummary): void {
    const topDaily = summary.top_daily as Record<string, DailyTopPlayer[] | null>;
    this.experiencePlayers.set(topDaily['experience'] ?? []);
    this.experienceLossPlayer.set(topDaily['experience_loss']?.[0] ?? null);

    const sections = HIGHSCORE_SECTIONS.filter((s) => s.value !== 'experience')
      .map((s) => ({
        name: s.value,
        label: s.label,
        players: topDaily[s.value] ?? [],
      }))
      .filter((s) => s.players.length > 0);

    this.skillsSection.set(sections);
  }
}
