import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import {
  HighscoreSection,
  PlayerHistoryInfo,
  PlayerHistoryRequest,
  PlayerHistoryResponse,
  TimePeriod,
} from '@core/models';
import { PlayerHistoryService } from '@core/services';
import { PlayerDetailHeaderComponent } from './player-detail-header/player-detail-header.component';
import { PlayerDetailSummaryComponent } from './player-detail-summary/player-detail-summary.component';
import { PeriodSelectorComponent } from '../../shared/period-selector/period-selector.component';
import { PlayerDetailChartComponent } from './player-detail-chart/player-detail-chart.component';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
  imports: [
    PlayerDetailHeaderComponent,
    PlayerDetailSummaryComponent,
    PeriodSelectorComponent,
    PlayerDetailChartComponent,
  ],
})
export class PlayerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly playerHistoryService = inject(PlayerHistoryService);

  // Player state
  playerName = signal<string>('');
  playerInfo = signal<PlayerHistoryInfo | null>(null);
  section = signal<HighscoreSection>('experience');
  summary = computed(() => this.historyData()?.summary || null);

  // Chart state
  selectedPeriod = signal<TimePeriod>('week');
  loading = signal<boolean>(false);
  historyData = signal<PlayerHistoryResponse | null>(null);

  ngOnInit(): void {
    // Subscribe to route changes to load player data
    this.route.paramMap
      .pipe(
        tap((params) => {
          const section = params.get('section') as HighscoreSection;
          if (!section) {
            this.router.navigate(['/']);
            throw new Error('No section provided');
          }
          this.section.set(section);
        }),
        switchMap(() => this.route.queryParamMap),
      )
      .subscribe((queryParams) => {
        const name = queryParams.get('name');
        if (!name) {
          this.router.navigate(['/']);
          return;
        }

        this.playerName.set(name);
        this.loadPlayerHistory();
      });
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    this.loadPlayerHistory();
  }

  onSectionChange(section: HighscoreSection): void {
    this.section.set(section);
    // Navigation will trigger ngOnInit which reloads data
    this.router.navigate(['/player', section], {
      queryParams: { name: this.playerName() },
    });
  }

  private async loadPlayerHistory(): Promise<void> {
    this.loading.set(true);

    try {
      const request: PlayerHistoryRequest = {
        p_name: this.playerName(),
        p_section: this.section(),
        p_period: this.selectedPeriod(),
      };

      const data = await this.playerHistoryService.getPlayerHistoric(request);

      if (data) {
        this.historyData.set(data);
        this.playerInfo.set(data.player);
      } else {
        this.historyData.set(null);
        this.playerInfo.set(null);
      }
    } catch (error) {
      console.error('Error loading player history:', error);
      this.historyData.set(null);
      this.playerInfo.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
