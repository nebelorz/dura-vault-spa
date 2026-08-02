import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HighscoreSection, PlayerAchievement } from '@core/models';
import {
  ACHIEVEMENT_CATEGORY_LABEL,
  AchievementBadgeStyle,
  HIGHSCORE_SECTIONS,
  getCategoryBadgeStyle,
  getSectionLabel,
} from '@core/constants';
import {
  NoDataStatusComponent,
  LoadingStatusComponent,
  MinimalistIconComponent,
} from '@shared/components';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AchievementBadgeComponent } from './achievement-badge/achievement-badge.component';

interface AchievementGroup {
  category: string;
  categoryLabel: string;
  sections: AchievementSectionGroup[];
}

interface DisplayMilestone extends PlayerAchievement {
  displayDate: string | null;
}

interface AchievementSectionGroup {
  section: HighscoreSection;
  sectionLabel: string;
  milestones: DisplayMilestone[];
  highestMilestone: number;
  badgeStyle: AchievementBadgeStyle;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-player-achievements',
  templateUrl: './player-achievements.component.html',
  styleUrl: './player-achievements.component.scss',
  imports: [
    DatePipe,
    LoadingStatusComponent,
    NoDataStatusComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    AchievementBadgeComponent,
    MinimalistIconComponent,
  ],
})
export class PlayerAchievementsComponent {
  achievements = input.required<PlayerAchievement[]>();
  loading = input.required<boolean>();

  readonly groups = computed<AchievementGroup[]>(() => {
    const all = this.achievements();

    const categoryOrder = ['level', 'magic', 'skill'];
    const grouped = new Map<string, Map<HighscoreSection, PlayerAchievement[]>>();

    for (const a of all) {
      if (!grouped.has(a.category)) grouped.set(a.category, new Map());
      const bySection = grouped.get(a.category)!;
      if (!bySection.has(a.section)) bySection.set(a.section, []);
      bySection.get(a.section)!.push(a);
    }

    return categoryOrder
      .filter((cat) => grouped.has(cat))
      .map((cat) => ({
        category: cat,
        categoryLabel: ACHIEVEMENT_CATEGORY_LABEL[cat] ?? cat,
        sections: Array.from(grouped.get(cat)!.entries())
          .map(([sec, milestones]) => {
            const sorted = [...milestones].sort((a, b) => b.milestone - a.milestone);
            const highestMilestone = sorted[0].milestone;
            const seenDates = new Set<string>();
            const displayMilestones: DisplayMilestone[] = sorted.map((a) => {
              const displayDate = seenDates.has(a.achieved_date) ? null : a.achieved_date;
              seenDates.add(a.achieved_date);
              return { ...a, displayDate };
            });
            return {
              section: sec,
              sectionLabel: getSectionLabel(sec),
              milestones: displayMilestones,
              highestMilestone,
              badgeStyle: getCategoryBadgeStyle(cat),
            };
          })
          .sort(
            (a, b) =>
              HIGHSCORE_SECTIONS.findIndex((s) => s.value === a.section) -
              HIGHSCORE_SECTIONS.findIndex((s) => s.value === b.section),
          ),
      }));
  });

  readonly isEmpty = computed(() => !this.loading() && this.achievements().length === 0);
}
