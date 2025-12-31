import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighscoreSection } from '../../../core/models/highscore.model';
import { PlayerHistoryInfo } from '../../../core/models/player-history.model';
import { toSectionOptions, SectionOption } from '../../../core/constants';

import { SelectModule } from 'primeng/select';
import { MinimalistIconComponent } from '../../../shared/minimalist-icon/minimalist-icon.component';
import { GoBackButtonComponent } from '../../../shared/go-back-button/go-back-button.component';

@Component({
  selector: 'app-player-detail-header',
  templateUrl: './player-detail-header.component.html',
  styleUrls: ['./player-detail-header.component.scss'],
  imports: [SelectModule, FormsModule, MinimalistIconComponent, GoBackButtonComponent],
})
export class PlayerDetailHeaderComponent {
  // Inputs
  playerName = input.required<string>();
  section = input.required<HighscoreSection>();
  playerInfo = input<PlayerHistoryInfo | null>(null);

  // Outputs
  sectionChange = output<HighscoreSection>();

  readonly sectionOptions: SectionOption[] = toSectionOptions();

  onSectionChange(newSection: HighscoreSection): void {
    this.sectionChange.emit(newSection);
  }
}
