import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighscoreSection, PlayerDetailsInfo } from '@core/models';
import { toSectionOptions, SectionOption } from '@core/constants';
import { GoBackButtonComponent } from '../../../shared/components/go-back-button/go-back-button.component';

import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-player-detail-header',
  templateUrl: './player-detail-header.component.html',
  styleUrls: ['./player-detail-header.component.scss'],
  imports: [SelectModule, FormsModule, GoBackButtonComponent],
})
export class PlayerDetailHeaderComponent {
  // Inputs
  playerName = input.required<string>();
  section = input.required<HighscoreSection>();
  playerInfo = input<PlayerDetailsInfo | null>(null);

  // Outputs
  sectionChange = output<HighscoreSection>();

  readonly sectionOptions: SectionOption[] = toSectionOptions();

  onSectionChange(newSection: HighscoreSection): void {
    this.sectionChange.emit(newSection);
  }
}
