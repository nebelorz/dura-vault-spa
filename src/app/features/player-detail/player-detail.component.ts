import { Component, OnInit, signal, computed, inject, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  CharacterProfileResult,
  HighscoreSection,
  PlayerHistoricRequest,
  PlayerHistoricResponse,
  PlayerOnlineResponse,
  PlayerStatsRecord,
  TimePeriod,
  PeriodOption,
} from '@core/models';
import { CharacterProfileService, PlayerDetailsService, OnlineService } from '@core/services';
import { PlayerDetailHeaderComponent } from './player-detail-header/player-detail-header.component';
import { PeriodSelectorComponent, MinimalistIconComponent } from '@shared/components';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { PlayerPerformanceComponent } from './player-performance/player-performance.component';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
  imports: [
    PlayerDetailHeaderComponent,
    PeriodSelectorComponent,
    MinimalistIconComponent,
    PlayerStatsComponent,
    PlayerPerformanceComponent,
    DatePipe,
  ],
})
export class PlayerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playerDetailsService = inject(PlayerDetailsService);
  private readonly onlineService = inject(OnlineService);
  protected readonly characterProfileService = inject(CharacterProfileService);
  private readonly destroyRef = inject(DestroyRef);

  // State
  playerName = signal<string>('');
  section = signal<HighscoreSection>('experience');
  selectedPeriod = signal<TimePeriod>('all');
  loading = signal<boolean>(false);
  playerDetailsData = signal<PlayerHistoricResponse | null>(null);
  playerOnlineData = signal<PlayerOnlineResponse | null>(null);
  playerStats = signal<PlayerStatsRecord[]>([]);
  characterProfile = signal<CharacterProfileResult | null>(null);

  // "All" -> "Active Period"
  readonly periodOptions: PeriodOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'Active Period', value: 'all' },
  ];

  // Computed
  summary = computed(() => this.playerDetailsData()?.summary ?? null);
  dailyRecords = computed(() => this.playerDetailsData()?.daily ?? []);
  vocation = computed(() => {
    const stats = this.playerStats();
    return (
      stats.find((s) => s.section === 'experience')?.vocation ??
      stats.find((s) => s.vocation)?.vocation ??
      ''
    );
  });
  dateRange = computed(() => {
    const summaryData = this.summary();
    if (!summaryData) return [];
    return [summaryData.day_first, summaryData.day_last];
  });

  ngOnInit(): void {
    // Subscribe to route changes to load player data
    this.route.paramMap
      .pipe(
        tap((params) => {
          const name = params.get('name');
          if (!name) {
            this.router.navigate(['/']);
            throw new Error('No player name provided');
          }
          this.playerName.set(name);
          this.loadCharacterProfile(name);
        }),
        switchMap(() => this.route.queryParamMap),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((queryParams) => {
        const section = (queryParams.get('section') as HighscoreSection) ?? 'experience';
        this.section.set(section);
        this.loadPlayerDetails();
      });
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    this.loadPlayerDetails();
  }

  onSectionChange(section: HighscoreSection): void {
    this.section.set(section);
    // Navigation will trigger ngOnInit which reloads data
    this.router.navigate(['/player', this.playerName()], {
      queryParams: { section },
    });
  }

  private async loadPlayerDetails(): Promise<void> {
    this.loading.set(true);
    let redirecting = false;

    try {
      const request: PlayerHistoricRequest = {
        p_name: this.playerName(),
        p_section: this.section(),
        p_period: this.selectedPeriod(),
      };

      const [data, stats, onlineData] = await Promise.all([
        this.playerDetailsService.getPlayerHistoric(request),
        this.playerDetailsService.getPlayerStats(this.playerName()),
        this.onlineService.getPlayerOnlineHistory(this.playerName(), this.selectedPeriod(), false),
      ]);

      const resolvedStats = stats ?? [];
      const availableSections = resolvedStats.map((s) => s.section as HighscoreSection);
      const currentSection = this.section();

      // If the requested section has no data for this player, redirect to the first available
      if (resolvedStats.length > 0 && !availableSections.includes(currentSection)) {
        redirecting = true;
        this.playerStats.set(resolvedStats);
        this.router.navigate(['/player', this.playerName()], {
          queryParams: { section: availableSections[0] },
          replaceUrl: true,
        });
        return;
      }

      this.playerStats.set(resolvedStats);

      if (data) {
        this.playerDetailsData.set(data);
      } else {
        this.playerDetailsData.set(null);
      }

      this.playerOnlineData.set(onlineData);
    } finally {
      if (!redirecting) this.loading.set(false);
    }
  }

  private async loadCharacterProfile(name: string): Promise<void> {
    this.characterProfile.set(null);
    const profile = await this.characterProfileService.getCharacterProfile(name);
    this.characterProfile.set(profile);
  }
}
