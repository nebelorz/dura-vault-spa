import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CharacterDeath, CharacterProfileResult } from '@core/models';
import { InlineLoadingComponent, NoDataStatusComponent } from '@shared/components';

interface DescriptionSegment {
  text: string;
  isKiller: boolean;
}

interface DeathRow extends CharacterDeath {
  hasKiller: boolean;
  isUnjustified: boolean;
  segments: DescriptionSegment[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-deaths',
  templateUrl: './player-deaths.component.html',
  styleUrl: './player-deaths.component.scss',
  imports: [DatePipe, NgClass, RouterLink, InlineLoadingComponent, NoDataStatusComponent],
})
export class PlayerDeathsComponent {
  profile = input<CharacterProfileResult | null>(null);
  profileLoading = input.required<boolean>();

  readonly deathRows = computed<DeathRow[]>(() => {
    const player = this.profile();
    if (player?.status !== 'found') return [];
    return player.data.deaths.map((death) => ({
      ...death,
      hasKiller: death.killers.length > 0,
      isUnjustified: death.description.toLowerCase().includes('(unjustified)'),
      segments: PlayerDeathsComponent.parseSegments(death.description, death.killers),
    }));
  });

  readonly isAvailable = computed(() => this.profile()?.status === 'found');

  private static parseSegments(description: string, killers: string[]): DescriptionSegment[] {
    if (!killers.length) return [{ text: description, isKiller: false }];
    let segments: DescriptionSegment[] = [{ text: description, isKiller: false }];
    for (const killer of killers) {
      const next: DescriptionSegment[] = [];
      for (const seg of segments) {
        if (seg.isKiller) {
          next.push(seg);
          continue;
        }
        const idx = seg.text.indexOf(killer);
        if (idx === -1) {
          next.push(seg);
          continue;
        }
        if (idx > 0) next.push({ text: seg.text.slice(0, idx), isKiller: false });
        next.push({ text: killer, isKiller: true });
        if (idx + killer.length < seg.text.length)
          next.push({ text: seg.text.slice(idx + killer.length), isKiller: false });
      }
      segments = next;
    }
    return segments;
  }
}
