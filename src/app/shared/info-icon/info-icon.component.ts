import { Component, input } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-info-icon',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './info-icon.component.html',
  styleUrls: ['./info-icon.component.scss'],
})
export class InfoIconComponent {
  text = input.required<string>();
  size = input<string>('');
  tooltipPosition = input<string>('top');
}
