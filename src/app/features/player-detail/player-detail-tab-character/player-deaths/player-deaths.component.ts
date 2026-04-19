import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { CharacterDeath, CharacterProfileResult } from '@core/models';
import { InlineLoadingComponent, NoDataStatusComponent } from '@shared/components';

interface DeathRow extends CharacterDeath {
  hasKiller: boolean;
  isUnjustified: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-deaths',
  templateUrl: './player-deaths.component.html',
  styleUrl: './player-deaths.component.scss',
  imports: [DatePipe, NgClass, InlineLoadingComponent, NoDataStatusComponent],
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
    }));
  });

  readonly isAvailable = computed(() => this.profile()?.status === 'found');
}
