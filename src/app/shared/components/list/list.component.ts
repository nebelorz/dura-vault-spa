import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { PodiumListItem } from '@core/models/podium-list.model';
import { MetricDisplayComponent } from '../metric-display/metric-display.component';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-list',
  imports: [NgClass, MetricDisplayComponent, TooltipModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  items = input.required<PodiumListItem[]>();
  showFilter = input<boolean>(false);
  filterLabel = input<string>('Filter by name');
  rankOffset = input<number>(0);

  itemClick = output<PodiumListItem>();
  itemRightClick = output<{ event: MouseEvent; item: PodiumListItem }>();
  filterChange = output<string>();
}
