import { Component, OnInit, signal, computed, inject, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CharacterProfileService, PlayerDetailsService, OnlineService } from '@core/services';
import {
  CharacterProfileResult,
  HighscoreSection,
  PlayerAchievement,
  PlayerHistoricRequest,
  PlayerHistoricResponse,
  PlayerOnlineResponse,
  PlayerStatsRecord,
  TimePeriod,
  PeriodOption,
} from '@core/models';

import { PeriodSelectorComponent, MinimalistIconComponent } from '@shared/components';
import { PlayerDetailHeaderComponent } from './player-detail-header/player-detail-header.component';
import { PlayerDetailTabCharacterComponent } from './player-detail-middle-section/player-detail-tab-character/player-detail-tab-character.component';
import { PlayerStatsComponent } from './player-detail-left-section/player-stats/player-stats.component';
import { PlayerOnlineStatsComponent } from './player-detail-left-section/player-online-stats/player-online-stats.component';
import { PlayerAchievementsComponent } from './player-detail-right-section/player-achievements/player-achievements.component';
import { PlayerDetailTabPerformanceComponent } from './player-detail-middle-section/player-detail-tab-performance/player-detail-tab-performance.component';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

@Component({
  standalone: true,
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.scss',
  imports: [
    PlayerDetailHeaderComponent,
    PeriodSelectorComponent,
    MinimalistIconComponent,
    PlayerStatsComponent,
    PlayerOnlineStatsComponent,
    PlayerAchievementsComponent,
    PlayerDetailTabPerformanceComponent,
    PlayerDetailTabCharacterComponent,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    DatePipe,
  ],
})
export class PlayerDetailComponent implements OnInit {
  private detailsRequestId = 0;
  private profileRequestId = 0;
  private readonly characterProfileService = inject(CharacterProfileService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly onlineService = inject(OnlineService);
  private readonly playerDetailsService = inject(PlayerDetailsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // State
  readonly characterTab = '0';
  readonly performanceTab = '1';
  activeTab = signal<string>(this.characterTab);
  achievementsLoading = signal<boolean>(true);
  characterProfile = signal<CharacterProfileResult | null>(null);
  loading = signal<boolean>(true);
  playerAchievements = signal<PlayerAchievement[]>([]);
  playerDetailsData = signal<PlayerHistoricResponse | null>(null);
  playerName = signal<string>('');
  playerOnlineData = signal<PlayerOnlineResponse | null>(null);
  playerStats = signal<PlayerStatsRecord[]>([]);
  profileLoading = signal<boolean>(true);
  section = signal<HighscoreSection>('experience');
  selectedPeriod = signal<TimePeriod>('all');

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
  lastLogin = computed(() => {
    const profile = this.characterProfile();
    return profile?.status === 'found' ? profile.data.characterInformation.lastLogin : null;
  });
  vocation = computed(() => {
    const stats = this.playerStats();
    return (
      stats.find((stat) => stat.section === 'experience')?.vocation ??
      stats.find((stat) => stat.vocation)?.vocation ??
      ''
    );
  });
  dateRange = computed(() => {
    const summaryData = this.summary();
    const fromDate = summaryData?.day_first ?? null;
    const toDate = summaryData?.day_last ?? null;
    if (!fromDate && !toDate) return [];
    if (!fromDate) return [toDate!];
    if (!toDate || fromDate === toDate) return [fromDate];
    return [fromDate, toDate];
  });

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, queryParams]) => {
        const name = params.get('name');
        if (!name) {
          void this.router.navigate(['/']);
          return;
        }

        const nextSection = (queryParams.get('section') as HighscoreSection) ?? 'experience';
        const nameChanged = name !== this.playerName();

        if (nameChanged) {
          this.playerName.set(name);
          this.activeTab.set(this.characterTab);
          this.playerStats.set([]);
          this.playerAchievements.set([]);
          this.resetDetailsState();
          void this.loadCharacterProfile(name);
          void this.loadPlayerAchievements(name);
        }

        if (nextSection !== this.section()) {
          this.section.set(nextSection);
        }

        void this.loadPlayerDetails();
      });
  }

  onPeriodChange(period: TimePeriod): void {
    if (period === this.selectedPeriod()) return;
    this.selectedPeriod.set(period);
    void this.loadPlayerDetails();
  }

  onTabChange(value: string | number | undefined): void {
    if (value != null) this.activeTab.set(String(value));
  }

  onSectionChange(section: HighscoreSection): void {
    this.activeTab.set(this.performanceTab);
    if (section === this.section()) return;

    void this.router.navigate(['/player', this.playerName()], {
      queryParams: { section },
    });
  }

  private async loadPlayerDetails(): Promise<void> {
    const requestId = ++this.detailsRequestId;
    const playerName = this.playerName();
    const section = this.section();
    const period = this.selectedPeriod();

    this.loading.set(true);
    this.resetDetailsState();

    try {
      const request: PlayerHistoricRequest = {
        p_name: playerName,
        p_section: section,
        p_period: period,
      };

      const [data, stats, onlineData] = await Promise.all([
        this.playerDetailsService.getPlayerHistoric(request),
        this.playerDetailsService.getPlayerStats(playerName),
        this.onlineService.getPlayerOnlineHistory(playerName, period, false),
      ]);

      if (requestId !== this.detailsRequestId) return;

      const resolvedStats = stats ?? [];
      const availableSections = resolvedStats.map((stat) => stat.section as HighscoreSection);

      this.playerStats.set(resolvedStats);

      // If the requested section has no data for this player, redirect to the first available
      if (resolvedStats.length > 0 && !availableSections.includes(section)) {
        await this.router.navigate(['/player', playerName], {
          queryParams: { section: availableSections[0] },
          replaceUrl: true,
        });
        return;
      }

      this.playerDetailsData.set(data);
      this.playerOnlineData.set(onlineData);
    } finally {
      if (requestId === this.detailsRequestId) {
        this.loading.set(false);
      }
    }
  }

  private async loadPlayerAchievements(name: string): Promise<void> {
    this.achievementsLoading.set(true);
    try {
      const achievements = await this.playerDetailsService.getPlayerAchievements(name);
      this.playerAchievements.set(achievements);
    } finally {
      this.achievementsLoading.set(false);
    }
  }

  private async loadCharacterProfile(name: string): Promise<void> {
    const requestId = ++this.profileRequestId;

    this.characterProfile.set(null);
    this.profileLoading.set(true);

    try {
      const profile = await this.characterProfileService.getCharacterProfile(name);
      if (requestId !== this.profileRequestId) return;

      this.characterProfile.set(profile);
    } finally {
      if (requestId === this.profileRequestId) {
        this.profileLoading.set(false);
      }
    }
  }

  private resetDetailsState(): void {
    this.playerDetailsData.set(null);
    this.playerOnlineData.set(null);
  }
}
