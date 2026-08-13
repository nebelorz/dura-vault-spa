import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

import { PodiumListItem } from '@core/models';
import { ServerService } from '@core/services';
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
  private readonly router = inject(Router);
  private readonly serverService = inject(ServerService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

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
    this.showHint();
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

  private showHint(): void {
    timer(300)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Right-click on a row to see more options',
        });
      });
  }
}
