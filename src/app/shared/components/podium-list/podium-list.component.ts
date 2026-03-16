import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { LoadingStatusComponent } from '../loading-status/loading-status.component';
import { NoDataStatusComponent } from '../no-data-status/no-data-status.component';

export interface ListColumn {
  label: string;
  value: string;
  valueClass?: string;
  podiumValue?: string; // Override value displayed in the podium (does not affect the list)
  subValue?: string; // Sub-text shown below the value in the list view (does not affect the podium)
  subValueClass?: string;
}

export interface PodiumListItem {
  id: string;
  rank: number;
  name: string;
  meta: string;
  columns: ListColumn[]; // Metrics to display. All columns are iterated in both the podium and the list
  rowClass?: string;
}

@Component({
  selector: 'app-podium-list',
  templateUrl: './podium-list.component.html',
  styleUrls: ['./podium-list.component.scss'],
  imports: [NgClass, LoadingStatusComponent, NoDataStatusComponent],
})
export class PodiumListComponent {
  items = input.required<PodiumListItem[]>();
  loading = input.required<boolean>();
  emptyMessage = input<string>('No data available.');
  disablePodium = input<boolean>(false); // If true, all items are rendered in the list and no podium
  hideOverlay = input<boolean>(false); // If true, no mouse-over overlay is shown for podium characters
  showFilter = input<boolean>(true); // If true, a search field is shown at the top of the list
  filterLabel = input<string>('Filter by name'); // Label for the search field

  itemClick = output<PodiumListItem>();
  itemRightClick = output<{ event: MouseEvent; item: PodiumListItem }>();
  filterChange = output<string>();

  readonly topThree = computed(() => (this.disablePodium() ? [] : this.items().slice(0, 3)));
  readonly restOfList = computed(() =>
    this.disablePodium() ? this.items() : this.items().slice(3),
  );
}
