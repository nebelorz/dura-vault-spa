import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AccountInformation, CharacterEntry, CharacterProfileResult } from '@core/models';
import { InlineLoadingComponent, NoDataStatusComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-account-information',
  templateUrl: './player-account-information.component.html',
  styleUrl: './player-account-information.component.scss',
  imports: [DatePipe, RouterLink, InlineLoadingComponent, NoDataStatusComponent],
})
export class PlayerAccountInformationComponent {
  profile = input<CharacterProfileResult | null>(null);
  profileLoading = input.required<boolean>();

  readonly characters = computed<CharacterEntry[]>(() => {
    const player = this.profile();
    const chars = player?.status === 'found' ? player.data.characters : [];
    return [...chars].sort((a, b) => (b.level ?? -1) - (a.level ?? -1));
  });

  readonly accountInfo = computed<AccountInformation | null>(() => {
    const player = this.profile();
    return player?.status === 'found' ? player.data.accountInformation : null;
  });

  readonly isAvailable = computed(() => this.profile()?.status === 'found');

  readonly hasAccountInfo = computed(() => {
    const info = this.accountInfo();
    return !!(info?.created || info?.banishedUntil || info?.status);
  });
}
