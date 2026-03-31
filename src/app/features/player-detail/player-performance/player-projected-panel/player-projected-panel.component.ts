import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerDetailsSummary } from '@core/models';
import { MinimalistIconComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-projected-panel',
  templateUrl: './player-projected-panel.component.html',
  styleUrls: ['./player-projected-panel.component.scss'],
  imports: [DatePipe, MinimalistIconComponent],
})
export class PlayerProjectedPanelComponent {
  summary = input<PlayerDetailsSummary | null>(null);
}
