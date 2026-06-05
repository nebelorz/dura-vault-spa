import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { VOCATION_GROUPS } from '@core/constants';
import { HighscoreRecord, MetricType, Section } from '@core/models';
import {
  getMetricGainOrLossTooltip,
  getMetricPercentageOfTotalEXP,
  getMetricTooltip,
} from '@shared/functions';
import {
  LoadingStatusComponent,
  MetricDisplayComponent,
  NoDataStatusComponent,
} from '@shared/components';

interface VocDetailColumn {
  metric: MetricType;
  gainValue: number;
  valueTooltip?: string;
  abbreviate: boolean;
  percentagePointsTotal?: number;
  subValue?: string;
  subValueTooltip?: string;
}

interface VocationTopItem {
  group: string;
  name: string;
  columns: VocDetailColumn[];
  link: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-by-vocation-cards',
  templateUrl: './highscore-top-by-vocation-cards.component.html',
  styleUrl: './highscore-top-by-vocation-cards.component.scss',
  imports: [
    NgTemplateOutlet,
    RouterLink,
    LoadingStatusComponent,
    MetricDisplayComponent,
    NoDataStatusComponent,
  ],
})
export class HighscoreTopPerVocationCardsComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  readonly knight = computed(() => this.topItem('Knight'));
  readonly paladin = computed(() => this.topItem('Paladin'));
  readonly sorcerer = computed(() => this.topItem('Sorcerer'));
  readonly druid = computed(() => this.topItem('Druid'));
  readonly none = computed(() => this.topItem('None'));

  readonly queryParams = computed(() => ({ section: this.section() }));

  private readonly isXpSection = computed(
    () => this.section() === 'experience' || this.section() === 'experience_loss',
  );

  private readonly tops = computed<Record<string, HighscoreRecord>>(() => {
    const isXp = this.isXpSection();
    const getGain = (record: HighscoreRecord): number =>
      isXp ? Math.abs(record.gain_points) : record.gain_level;
    const result: Record<string, HighscoreRecord> = {};

    for (const record of this.data()) {
      const group = VOCATION_GROUPS[record.vocation];
      if (!group) continue;
      const existing = result[group];
      if (!existing || getGain(record) > getGain(existing)) result[group] = record;
    }

    return result;
  });

  private topItem(group: string): VocationTopItem | null {
    const record = this.tops()[group];
    if (!record) return null;

    const isXp = this.isXpSection();

    const columns: VocDetailColumn[] = isXp
      ? [
          {
            metric: 'experience',
            gainValue: record.gain_points,
            valueTooltip: getMetricGainOrLossTooltip('experience', record.gain_points < 0),
            abbreviate: true,
            percentagePointsTotal: record.points ?? undefined,
            subValueTooltip: getMetricPercentageOfTotalEXP(),
          },
          {
            metric: 'level',
            gainValue: record.gain_level,
            valueTooltip: getMetricGainOrLossTooltip('level', record.gain_level < 0),
            abbreviate: false,
            subValue: `${record.level}`,
            subValueTooltip: getMetricTooltip('level'),
          },
          {
            metric: 'rank',
            gainValue: record.gain_rank,
            valueTooltip: getMetricGainOrLossTooltip('rank', record.gain_rank < 0),
            abbreviate: false,
            subValue: `#${record.rank}`,
            subValueTooltip: getMetricTooltip('rank'),
          },
        ]
      : [
          {
            metric: 'skill',
            gainValue: record.gain_level,
            valueTooltip: getMetricGainOrLossTooltip('skill', record.gain_level < 0),
            abbreviate: false,
            subValue: `${record.level}`,
            subValueTooltip: getMetricTooltip('skill'),
          },
          {
            metric: 'rank',
            gainValue: record.gain_rank,
            valueTooltip: getMetricGainOrLossTooltip('rank', record.gain_rank < 0),
            abbreviate: false,
            subValue: `#${record.rank}`,
            subValueTooltip: getMetricTooltip('rank'),
          },
        ];

    return { group, name: record.name, columns, link: ['/player', record.name] };
  }
}
