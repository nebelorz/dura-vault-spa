import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { PodiumListItem } from '@core/models/podium-list.model';
import { MetricDisplayComponent } from '../../metric-display/metric-display.component';
import { BadgeComponent } from '../../badge/badge.component';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-list',
  imports: [NgClass, MetricDisplayComponent, TooltipModule, BadgeComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  items = input.required<PodiumListItem[]>();
  rankOffset = input<number>(0);
  emptyMessage = input<string>('No results found');

  itemClick = output<PodiumListItem>();
  itemRightClick = output<{ event: MouseEvent; item: PodiumListItem }>();
}
