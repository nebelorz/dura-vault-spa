import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import {
  HighscoreSection,
  PlayerDetailsInfo,
  PlayerDetailsRequest,
  PlayerDetailsResponse,
  TimePeriod,
  PeriodOption,
} from '@core/models';
import { PlayerDetailsService } from '@core/services';
import { PlayerDetailHeaderComponent } from './player-detail-header/player-detail-header.component';
import { PeriodSelectorComponent } from '../../shared/components/period-selector/period-selector.component';
import { PlayerDetailChartComponent } from './player-detail-chart/player-detail-chart.component';
import { PlayerSummaryComponent } from './player-summary/player-summary.component';
import { MinimalistIconComponent } from '@shared/components';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
  imports: [
    PlayerDetailHeaderComponent,
    PeriodSelectorComponent,
    PlayerDetailChartComponent,
    PlayerSummaryComponent,
    MinimalistIconComponent,
  ],
})
export class PlayerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playerDetailsService = inject(PlayerDetailsService);

  // State
  playerName = signal<string>('');
  playerInfo = signal<PlayerDetailsInfo | null>(null);
  section = signal<HighscoreSection>('experience');
  selectedPeriod = signal<TimePeriod>('week');
  loading = signal<boolean>(false);
  playerDetailsData = signal<PlayerDetailsResponse | null>(null);

  // "All" -> "Active Days"
  periodOptions: PeriodOption[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'Active Days', value: 'all' },
  ];

  // Computed
  summary = computed(() => this.playerDetailsData()?.summary || null);
  dailyRecords = computed(() => this.playerDetailsData()?.daily || []);
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
        }),
        switchMap(() => this.route.queryParamMap),
      )
      .subscribe((queryParams) => {
        const section = queryParams.get('section') as HighscoreSection;
        if (!section) {
          this.router.navigate(['/']);
          return;
        }

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

    try {
      const request: PlayerDetailsRequest = {
        p_name: this.playerName(),
        p_section: this.section(),
        p_period: this.selectedPeriod(),
      };

      const data = await this.playerDetailsService.getPlayerDetails(request);

      if (data) {
        this.playerDetailsData.set(data);
        this.playerInfo.set(data.player);
      } else {
        this.playerDetailsData.set(null);
        this.playerInfo.set(null);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
