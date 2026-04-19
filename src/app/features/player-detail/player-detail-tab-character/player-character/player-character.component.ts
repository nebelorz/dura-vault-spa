import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CharacterHouse, CharacterProfileData, CharacterProfileResult } from '@core/models';
import { InlineLoadingComponent, NoDataStatusComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-character',
  templateUrl: './player-character.component.html',
  styleUrl: './player-character.component.scss',
  imports: [DatePipe, InlineLoadingComponent, NoDataStatusComponent],
})
export class PlayerCharacterComponent {
  profile = input<CharacterProfileResult | null>(null);
  profileLoading = input.required<boolean>();

  readonly profileData = computed((): CharacterProfileData | null => {
    const player = this.profile();
    return player?.status === 'found' ? player.data : null;
  });

  readonly houses = computed<CharacterHouse[]>(() => {
    const player = this.profile();
    return player?.status === 'found' ? player.data.houses : [];
  });
}
