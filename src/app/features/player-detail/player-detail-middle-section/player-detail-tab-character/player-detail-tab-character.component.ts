import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CharacterProfileResult } from '@core/models';
import { ErrorStatusComponent } from '@shared/components';
import { PlayerCharacterComponent } from './player-character/player-character.component';
import { PlayerAccountInformationComponent } from './player-account-information/player-account-information.component';
import { PlayerDeathsComponent } from './player-deaths/player-deaths.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-tab-character',
  templateUrl: './player-detail-tab-character.component.html',
  styleUrl: './player-detail-tab-character.component.scss',
  imports: [
    ErrorStatusComponent,
    PlayerCharacterComponent,
    PlayerAccountInformationComponent,
    PlayerDeathsComponent,
  ],
})
export class PlayerDetailTabCharacterComponent {
  profile = input<CharacterProfileResult | null>(null);
  profileLoading = input.required<boolean>();
  error = input(false);

  // Outputs
  retry = output<void>();
}
