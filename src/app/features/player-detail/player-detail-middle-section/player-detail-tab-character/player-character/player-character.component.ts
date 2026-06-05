import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CharacterHouse, CharacterProfileData, CharacterProfileResult } from '@core/models';
import {
  MinimalistIconComponent,
  NoDataStatusComponent,
  LoadingStatusComponent,
} from '@shared/components';
import { getDuraGuildUrl, getDuraPlayerUrl } from '@shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-character',
  templateUrl: './player-character.component.html',
  styleUrl: './player-character.component.scss',
  imports: [DatePipe, MinimalistIconComponent, NoDataStatusComponent, LoadingStatusComponent],
})
export class PlayerCharacterComponent {
  profile = input<CharacterProfileResult | null>(null);
  profileLoading = input.required<boolean>();

  readonly getDuraGuildUrl = getDuraGuildUrl;
  readonly getDuraPlayerUrl = getDuraPlayerUrl;
  readonly iconSizeExternalLink = '8px';

  readonly profileData = computed((): CharacterProfileData | null => {
    const player = this.profile();
    return player?.status === 'found' ? player.data : null;
  });

  readonly houses = computed<CharacterHouse[]>(() => {
    const player = this.profile();
    return player?.status === 'found' ? player.data.houses : [];
  });
}
