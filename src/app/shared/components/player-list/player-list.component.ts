import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { PodiumListItem } from '@core/models/podium-list.model';

import { SearchInputComponent } from './search-input/search-input.component';
import { PodiumComponent } from './podium/podium.component';
import { ListComponent } from './list/list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-player-list',
  imports: [SearchInputComponent, PodiumComponent, ListComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent {
  // Inputs
  items = input.required<PodiumListItem[]>();
  displayPodium = input(true);
  displayFilter = input(true);
  displayList = input(true);
  filterPlaceholder = input('Filter by name');
  emptyMessage = input('No results found');

  // Outputs
  itemClick = output<PodiumListItem>();
  itemRightClick = output<{ event: MouseEvent; item: PodiumListItem }>();

  // Internal filter state
  private readonly filterValue = signal('');

  // Computed
  private readonly trimmedFilter = computed(() => this.filterValue().trim());
  private readonly hasFilter = computed(() => this.trimmedFilter().length > 0);

  private readonly filteredItems = computed(() => {
    const filter = this.trimmedFilter().toLowerCase();
    if (!filter) return this.items();
    return this.items().filter((item) => item.name.toLowerCase().includes(filter));
  });

  readonly podiumItems = computed(() => {
    if (!this.displayPodium() || this.hasFilter()) return [];
    return this.filteredItems().slice(0, 3);
  });

  readonly listItems = computed(() => {
    if (!this.displayList()) return [];
    const startIndex = this.displayPodium() && !this.hasFilter() ? 3 : 0;
    return this.filteredItems().slice(startIndex);
  });

  readonly rankOffset = computed(() => {
    return this.displayPodium() && !this.hasFilter() ? 3 : 0;
  });

  protected onSearchChange(value: string): void {
    this.filterValue.set(value);
  }
}
