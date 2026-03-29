import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighscoreSection } from '@core/models';
import { toSectionOptions, SectionOption } from '@core/constants';
import { GoBackButtonComponent } from '@shared/components';

import { SelectModule } from 'primeng/select';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-header',
  templateUrl: './player-detail-header.component.html',
  styleUrls: ['./player-detail-header.component.scss'],
  imports: [SelectModule, FormsModule, GoBackButtonComponent],
})
export class PlayerDetailHeaderComponent {
  // Inputs
  playerName = input.required<string>();
  vocation = input<string>('');
  section = input.required<HighscoreSection>();

  // Outputs
  sectionChange = output<HighscoreSection>();

  readonly sectionOptions: SectionOption[] = toSectionOptions();

  onSectionChange(newSection: HighscoreSection): void {
    this.sectionChange.emit(newSection);
  }
}
