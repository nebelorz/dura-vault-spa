import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { DailyTopPlayer, SectionData } from '@core/models';
import { MetricType, getMetricLabel } from '@core/constants';
import {
  LoadingStatusComponent,
  MetricDisplayComponent,
  NoDataStatusComponent,
} from '@shared/components';
import { calculateGainPercentage } from '@shared/functions';

import { CarouselModule } from 'primeng/carousel';

interface PlayerMetricColumn {
  metric: MetricType;
  gainValue: number | null;
  abbreviate: boolean;
  currentValue: string;
  currentValueTooltip?: string;
  valueTooltip?: string;
  percentagePointsTotal?: number;
}

interface PlayerRow {
  name: string;
  vocation: string;
  columns: PlayerMetricColumn[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-daily-top-gainers',
  templateUrl: './daily-top-gainers.component.html',
  styleUrl: './daily-top-gainers.component.scss',
  imports: [
    DatePipe,
    UpperCasePipe,
    CarouselModule,
    LoadingStatusComponent,
    MetricDisplayComponent,
    NoDataStatusComponent,
  ],
})
export class DailyTopGainersComponent {
  private readonly router = inject(Router);
  public readonly getMetricLabel = getMetricLabel;

  // Inputs
  loading = input.required<boolean>();
  maxDate = input<string | null>(null);
  experiencePlayers = input<DailyTopPlayer[]>([]);
  experienceLossPlayer = input<DailyTopPlayer | null>(null);
  skillsSection = input<SectionData[]>([]);

  // Computed: Experience gain rows
  readonly experiencePlayerRows = computed<PlayerRow[]>(() =>
    this.experiencePlayers().map((player) => this.buildExperiencePlayerRow(player)),
  );

  // Computed: Experience loss row
  readonly experienceLossPlayerRow = computed<PlayerRow | null>(() => {
    const player = this.experienceLossPlayer();
    return player ? this.buildExperiencePlayerRow(player) : null;
  });

  // Computed: Skill section rows
  readonly skillPlayerRows = computed<Record<string, PlayerRow[]>>(() => {
    const sections = this.skillsSection();
    const result: Record<string, PlayerRow[]> = {};
    for (const section of sections) {
      result[section.name] = section.players.map((player) => this.buildSkillPlayerRow(player));
    }
    return result;
  });

  private buildExperiencePlayerRow(player: DailyTopPlayer): PlayerRow {
    const percentage = calculateGainPercentage(player.gain_points, player.points);
    const percentageSuffix = percentage ? ` ${percentage}` : '';
    const columns: PlayerMetricColumn[] = [
      {
        metric: 'experience',
        gainValue: player.gain_points,
        abbreviate: true,
        currentValue: `${percentageSuffix}`,
        percentagePointsTotal: player.points ?? undefined,
        currentValueTooltip: `Percentage of total ${getMetricLabel('experience', true)}`,
        valueTooltip: `${getMetricLabel('experience')} gain`,
      },
      {
        metric: 'level',
        gainValue: player.gain_level,
        abbreviate: false,
        currentValue: `${player.level}`,
        currentValueTooltip: `${getMetricLabel('level')}`,
        valueTooltip: `${getMetricLabel('level')} gain`,
      },
      {
        metric: 'rank',
        gainValue: player.gain_rank,
        abbreviate: false,
        currentValue: `#${player.rank}`,
        currentValueTooltip: `${getMetricLabel('rank')} gain`,
        valueTooltip: `${getMetricLabel('rank')} gain`,
      },
    ];
    return { name: player.name, vocation: player.vocation, columns };
  }

  private buildSkillPlayerRow(player: DailyTopPlayer): PlayerRow {
    const columns: PlayerMetricColumn[] = [
      {
        metric: 'skill',
        gainValue: player.gain_level,
        abbreviate: false,
        currentValue: `${player.level}`,
        currentValueTooltip: `${getMetricLabel('skill')}`,
        valueTooltip: `${getMetricLabel('skill')} gain`,
      },
      {
        metric: 'rank',
        gainValue: player.gain_rank,
        abbreviate: false,
        currentValue: `#${player.rank}`,
        currentValueTooltip: `${getMetricLabel('rank')}`,
        valueTooltip: `${getMetricLabel('rank')} gain`,
      },
    ];
    return { name: player.name, vocation: player.vocation, columns };
  }

  navigateToPlayer(playerName: string, section: string): void {
    this.router.navigate(['/player', playerName], {
      queryParams: { section },
    });
  }
}
