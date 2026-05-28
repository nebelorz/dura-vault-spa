import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { getSectionLabel } from '@core/constants';
import { HighscoreRecord, Section } from '@core/models';
import { formatNumber } from '@shared/functions';
import { LoadingStatusComponent, StatCardComponent, NoDataStatusComponent } from '@shared/components';

const VOCATION_GROUPS: Record<string, string> = {
  'Elite Knight': 'Knight',
  Knight: 'Knight',
  'Master Sorcerer': 'Sorcerer',
  Sorcerer: 'Sorcerer',
  'Elder Druid': 'Druid',
  Druid: 'Druid',
  'Royal Paladin': 'Paladin',
  Paladin: 'Paladin',
};

const VOCATION_ORDER = ['Knight', 'Paladin', 'Sorcerer', 'Druid'];

interface VocationTopItem {
  group: string;
  name: string;
  gainDisplay: string;
  link: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-vocation-tops',
  templateUrl: './highscore-vocation-tops.component.html',
  styleUrl: './highscore-vocation-tops.component.scss',
  imports: [LoadingStatusComponent, StatCardComponent, NoDataStatusComponent],
})
export class HighscoreVocationTopsComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  private readonly isXpSection = computed(
    () => this.section() === 'experience' || this.section() === 'experience_loss',
  );

  readonly metricColor = computed(() => {
    if (this.section() === 'experience_loss') return 'var(--color-danger)';
    return this.isXpSection() ? 'var(--color-xp)' : 'var(--color-skill)';
  });

  readonly queryParams = computed(() => ({ section: this.section() }));

  readonly items = computed<VocationTopItem[]>(() => {
    const isXp = this.isXpSection();
    const isLoss = this.section() === 'experience_loss';
    const getGain = (record: HighscoreRecord): number =>
      isXp ? Math.abs(record.gain_points) : record.gain_level;
    const tops: Record<string, HighscoreRecord> = {};

    for (const record of this.data()) {
      const group = VOCATION_GROUPS[record.vocation];
      if (!group) continue;
      const existing = tops[group];
      if (!existing || getGain(record) > getGain(existing)) tops[group] = record;
    }

    return VOCATION_ORDER.filter((group) => tops[group]).map((group) => {
      const record = tops[group];
      const gain = getGain(record);
      const gainPrefix = isLoss ? '-' : '';
      return {
        group,
        name: record.name,
        gainDisplay: isXp
          ? `${gainPrefix}${formatNumber(gain)} XP`
          : `${gain} ${getSectionLabel(this.section())}`,
        link: ['/player', record.name],
      };
    });
  });
}
