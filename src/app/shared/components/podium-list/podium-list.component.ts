import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { MetricType } from '@core/models';
import { MetricDisplayComponent } from '../metric-display/metric-display.component';
import { LoadingStatusComponent } from '../loading-status/loading-status.component';
import { NoDataStatusComponent } from '../no-data-status/no-data-status.component';

export interface MetricColumn {
  type: 'metric';
  metric: MetricType;
  value?: number;
  subValue?: string;
  abbreviate?: boolean;
  relativePercentagePointsFromTotal?: number;
  valueTooltip?: string;
  subValueTooltip?: string;
  iconTooltip?: string;
  labelTooltip?: string;
  tooltipPosition?: string;
}

export interface TextColumn {
  type: 'text';
  label: string;
  value: string;
  valueClass?: string;
  subValue?: string;
}

export interface PodiumListItem {
  id: string;
  rank: number;
  name: string;
  meta: string;
  columns: (MetricColumn | TextColumn)[];
  rowClass?: string;
  podiumClass?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-podium-list',
  templateUrl: './podium-list.component.html',
  styleUrl: './podium-list.component.scss',
  imports: [NgClass, MetricDisplayComponent, LoadingStatusComponent, NoDataStatusComponent],
})
export class PodiumListComponent {
  items = input.required<PodiumListItem[]>();
  loading = input.required<boolean>();
  emptyMessage = input<string>('No data available');
  disablePodium = input<boolean>(false); // If true, all items are rendered in the list and no podium
  hideOverlay = input<boolean>(false); // If true, no mouse-over overlay is shown for podium characters
  showFilter = input<boolean>(false); // If true, a search field is shown at the top of the list
  filterLabel = input<string>('Filter by name'); // Label for the search field

  itemClick = output<PodiumListItem>();
  itemRightClick = output<{ event: MouseEvent; item: PodiumListItem }>();
  filterChange = output<string>();

  readonly topThree = computed(() => (this.disablePodium() ? [] : this.items().slice(0, 3)));
  readonly restOfList = computed(() =>
    this.disablePodium() ? this.items() : this.items().slice(3),
  );
}
