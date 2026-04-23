import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerAchievement } from '@core/models';
import {
  ACHIEVEMENT_CATEGORY_LABEL,
  ACHIEVEMENT_SECTION_LABEL,
  AchievementBadgeStyle,
  getCategoryBadgeStyle,
} from '@core/constants';
import { InlineLoadingComponent, NoDataStatusComponent } from '@shared/components';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { AchievementBadgeComponent } from './achievement-badge/achievement-badge.component';

const CATEGORY_PATHS: Record<string, string> = {
  // Flat hexagon — level, magic_level, combat_skills
  level: 'M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z',
  magic_level: 'M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z',
  combat_skills: 'M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z',
  // Circle — fishing
  fishing: 'M50 5 A45 45 0 1 0 50 95 A45 45 0 1 0 50 5 Z',
};

const DEFAULT_PATH = CATEGORY_PATHS['level'];

interface AchievementGroup {
  category: string;
  categoryLabel: string;
  sections: AchievementSectionGroup[];
}

interface AchievementSectionGroup {
  section: string;
  sectionLabel: string;
  milestones: PlayerAchievement[];
  highestMilestone: number;
  badgeStyle: AchievementBadgeStyle;
  path: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-player-achievements',
  templateUrl: './player-achievements.component.html',
  styleUrl: './player-achievements.component.scss',
  imports: [
    DatePipe,
    InlineLoadingComponent,
    NoDataStatusComponent,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    AchievementBadgeComponent,
  ],
})
export class PlayerAchievementsComponent {
  achievements = input.required<PlayerAchievement[]>();
  loading = input.required<boolean>();

  readonly groups = computed<AchievementGroup[]>(() => {
    const all = this.achievements();

    const categoryOrder = ['level', 'magic_level', 'combat_skills', 'fishing'];
    const grouped = new Map<string, Map<string, PlayerAchievement[]>>();

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
            const sorted = [...milestones].sort((a, b) => a.milestone - b.milestone);
            const highestMilestone = sorted[sorted.length - 1].milestone;
            return {
              section: sec,
              sectionLabel: ACHIEVEMENT_SECTION_LABEL[sec] ?? sec,
              milestones: sorted,
              highestMilestone,
              badgeStyle: getCategoryBadgeStyle(cat),
              path: CATEGORY_PATHS[cat] ?? DEFAULT_PATH,
            };
          })
          .sort((a, b) => a.sectionLabel.localeCompare(b.sectionLabel)),
      }));
  });

  readonly isEmpty = computed(() => !this.loading() && this.achievements().length === 0);
}
