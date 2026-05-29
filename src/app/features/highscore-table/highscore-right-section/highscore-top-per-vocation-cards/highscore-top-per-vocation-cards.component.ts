import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { getSectionLabel, VOCATION_GROUPS } from '@core/constants';
import { HighscoreRecord, Section } from '@core/models';
import { formatNumber } from '@shared/functions';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

function formatSignedNumber(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `${n}`;
  return '0';
}

interface VocationTopItem {
  group: string;
  name: string;
  gainDisplay: string;
  levelGain?: string;
  levelCurrent?: string;
  rankGain: string;
  rankCurrent: string;
  link: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-per-vocation-cards',
  templateUrl: './highscore-top-per-vocation-cards.component.html',
  styleUrl: './highscore-top-per-vocation-cards.component.scss',
  imports: [NgClass, NgTemplateOutlet, RouterLink, LoadingStatusComponent, NoDataStatusComponent],
})
export class HighscoreTopPerVocationCardsComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

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
    const isLoss = this.section() === 'experience_loss';
    const gain = isXp ? Math.abs(record.gain_points) : record.gain_level;
    const gainPrefix = isLoss ? '-' : '+';
    const xpDetails = isXp
      ? { levelGain: formatSignedNumber(record.gain_level), levelCurrent: `${record.level}` }
      : {};

    return {
      group,
      name: record.name,
      gainDisplay: isXp
        ? `${gainPrefix}${formatNumber(gain)} XP`
        : `${gain} ${getSectionLabel(this.section())}`,
      ...xpDetails,
      rankGain: formatSignedNumber(record.gain_rank),
      rankCurrent: `#${record.rank}`,
      link: ['/player', record.name],
    };
  }

  readonly knight = computed(() => this.topItem('Knight'));
  readonly paladin = computed(() => this.topItem('Paladin'));
  readonly sorcerer = computed(() => this.topItem('Sorcerer'));
  readonly druid = computed(() => this.topItem('Druid'));
  readonly none = computed(() => this.topItem('None'));

  readonly gainClass = computed(() => {
    if (this.section() === 'experience_loss') return 'detail--xp-loss';
    return this.isXpSection() ? 'detail--xp' : 'detail--skill';
  });

  readonly queryParams = computed(() => ({ section: this.section() }));
}
