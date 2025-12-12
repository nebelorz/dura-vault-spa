import { Component, input } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-minimalist-icon',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './minimalist-icon.component.html',
  styleUrls: ['./minimalist-icon.component.scss'],
})
export class MinimalistIconComponent {
  icon = input<string>('pi-info-circle');
  size = input<string>('x-small');
  tooltipText = input<string>();
  tooltipPosition = input<string>('top');
}
