import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { PodiumListItem } from '@core/models';
import { ServerService, ToastService } from '@core/services';
import { getDuraPlayerUrl } from '@shared/functions';

import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

import { LoadingStatusComponent } from '../loading/loading-status/loading-status.component';
import { NoDataStatusComponent } from '../no-data-status/no-data-status.component';
import { PlayerListComponent } from '../player-list/player-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-actions-table',
  templateUrl: './player-actions-table.component.html',
  styleUrl: './player-actions-table.component.scss',
  imports: [ContextMenuModule, PlayerListComponent, LoadingStatusComponent, NoDataStatusComponent],
})
export class PlayerActionsTableComponent implements OnInit {
  private static readonly HINT_SEEN_KEY = 'dura-vault:player-context-menu-hint-seen';
  private static hintSeenInMemory = false;

  private readonly router = inject(Router);
  private readonly serverService = inject(ServerService);
  private readonly toastService = inject(ToastService);

  // Inputs
  items = input.required<PodiumListItem[]>();
  loading = input.required<boolean>();
  emptyMessage = input.required<string>();
  playerSection = input('experience');

  // PlayerList pass-throughs
  displayPodium = input(true);
  displayFilter = input(true);
  filterPlaceholder = input('Filter by name');
  listEmptyMessage = input('No results found');

  // State
  private selectedItem: PodiumListItem | null = null;

  // Child
  private readonly cm = viewChild<ContextMenu>('cm');

  // Context menu
  readonly contextMenuItems: MenuItem[] = [
    {
      label: 'Details',
      icon: 'pi pi-eye',
      command: () => this.viewPlayerDetails(),
    },
    { separator: true },
    {
      label: 'Search on Dura',
      icon: 'pi pi-external-link',
      command: () => this.searchOnDura(),
    },
  ];

  ngOnInit(): void {
    this.showHintOnce();
  }

  protected onItemClick(item: PodiumListItem): void {
    this.navigateToPlayer(item);
  }

  protected onItemRightClick({ event, item }: { event: MouseEvent; item: PodiumListItem }): void {
    this.selectedItem = item;
    this.cm()?.show(event);
  }

  private navigateToPlayer(item: PodiumListItem): void {
    this.router.navigate(['/player', item.name], {
      queryParams: { section: this.playerSection() },
      queryParamsHandling: 'merge',
    });
  }

  private viewPlayerDetails(): void {
    if (this.selectedItem) this.navigateToPlayer(this.selectedItem);
  }

  private searchOnDura(): void {
    if (!this.selectedItem) return;
    window.open(
      getDuraPlayerUrl(this.selectedItem.name, this.serverService.server()),
      '_blank',
      'noopener,noreferrer',
    );
  }

  private showHintOnce(): void {
    if (this.hasSeenHint()) return;
    this.toastService.info(
      'Right-click on a row to see more options',
      undefined,
      undefined,
      'bottom-right',
    );
    this.markHintSeen();
  }

  private hasSeenHint(): boolean {
    if (PlayerActionsTableComponent.hintSeenInMemory) return true;
    try {
      return localStorage.getItem(PlayerActionsTableComponent.HINT_SEEN_KEY) !== null;
    } catch {
      return false;
    }
  }

  private markHintSeen(): void {
    PlayerActionsTableComponent.hintSeenInMemory = true;
    try {
      localStorage.setItem(PlayerActionsTableComponent.HINT_SEEN_KEY, 'true');
    } catch {
      // Storage unavailable — the in-memory flag covers the rest of this session.
    }
  }
}
