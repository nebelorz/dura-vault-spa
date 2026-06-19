import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { VOCATION_GROUPS } from '@core/constants';
import { HighscoreRecord, MetricColumn, Section } from '@core/models';
import { buildMetrics } from '@shared/functions';
import {
  LoadingStatusComponent,
  MetricDisplayComponent,
  NoDataStatusComponent,
} from '@shared/components';

interface VocationTopItem {
  group: string;
  name: string;
  columns: MetricColumn[];
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
    const columns = buildMetrics(isXp ? 'level' : 'skill', record).map((col) => ({
      ...col,
      showIcon: false,
    }));

    return { group, name: record.name, columns, link: ['/player', record.name] };
  }
}
