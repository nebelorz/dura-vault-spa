import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-minimalist-icon',
  imports: [TooltipModule],
  templateUrl: './minimalist-icon.component.html',
  styleUrl: './minimalist-icon.component.scss',
})
export class MinimalistIconComponent {
  icon = input<string>('pi-info-circle');
  size = input<string>('xx-small');
  tooltipText = input<string>();
  tooltipPosition = input<string>('top');
}
