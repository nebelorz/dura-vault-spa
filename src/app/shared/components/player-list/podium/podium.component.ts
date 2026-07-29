import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { PodiumListItem } from '@core/models/podium-list.model';
import { MetricDisplayComponent } from '../../metric-display/metric-display.component';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-podium',
  imports: [NgClass, MetricDisplayComponent, TooltipModule],
  templateUrl: './podium.component.html',
  styleUrl: './podium.component.scss',
})
export class PodiumComponent {
  items = input.required<PodiumListItem[]>();

  itemClick = output<PodiumListItem>();
  itemRightClick = output<{ event: MouseEvent; item: PodiumListItem }>();
}
