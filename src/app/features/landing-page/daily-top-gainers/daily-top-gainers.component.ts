import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { DailyTopPlayer, MetricColumn, SectionData } from '@core/models';
import {
  LoadingStatusComponent,
  MetricDisplayComponent,
  NoDataStatusComponent,
} from '@shared/components';
import { buildMetrics } from '@shared/functions';

import { CarouselModule } from 'primeng/carousel';

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

  // Inputs
  loading = input.required<boolean>();
  maxDate = input<string | null>(null);
  experiencePlayers = input<DailyTopPlayer[]>([]);
  experienceLossPlayer = input<DailyTopPlayer | null>(null);
  skillsSection = input<SectionData[]>([]);

  // Computed: Experience gain rows
  readonly experiencePlayerRows = computed<
    { name: string; vocation: string; columns: MetricColumn[] }[]
  >(() => this.experiencePlayers().map((player) => this.buildExperiencePlayerRow(player)));

  // Computed: Experience loss row
  readonly experienceLossPlayerRow = computed<{
    name: string;
    vocation: string;
    columns: MetricColumn[];
  } | null>(() => {
    const player = this.experienceLossPlayer();
    return player ? this.buildExperiencePlayerRow(player) : null;
  });

  // Computed: Skill section rows
  readonly skillPlayerRows = computed<
    Record<string, { name: string; vocation: string; columns: MetricColumn[] }[]>
  >(() => {
    const sections = this.skillsSection();
    const result: Record<string, { name: string; vocation: string; columns: MetricColumn[] }[]> =
      {};
    for (const section of sections) {
      result[section.name] = section.players.map((player) => this.buildSkillPlayerRow(player));
    }
    return result;
  });

  private buildExperiencePlayerRow(player: DailyTopPlayer): {
    name: string;
    vocation: string;
    columns: MetricColumn[];
  } {
    return {
      name: player.name,
      vocation: player.vocation,
      columns: buildMetrics('level', player),
    };
  }

  private buildSkillPlayerRow(player: DailyTopPlayer): {
    name: string;
    vocation: string;
    columns: MetricColumn[];
  } {
    return {
      name: player.name,
      vocation: player.vocation,
      columns: buildMetrics('skill', player),
    };
  }

  navigateToPlayer(playerName: string, section: string): void {
    this.router.navigate(['/player', playerName], {
      queryParams: { section },
      queryParamsHandling: 'merge',
    });
  }
}
