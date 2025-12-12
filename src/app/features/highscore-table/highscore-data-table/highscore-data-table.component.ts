import { Component, input, viewChild, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

import { HighscoreRecord } from '../../../core/models/highscore.model';
import { AbsolutValuePipe } from '../../../shared/abs-value.pipe';

import { Table, TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-highscore-data-table',
  templateUrl: './highscore-data-table.component.html',
  styleUrls: ['./highscore-data-table.component.scss'],
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    ContextMenuModule,
    DecimalPipe,
    AbsolutValuePipe,
    SkeletonModule,
  ],
})
export class HighscoreDataTableComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<string>();
  globalFilterFields = input<string[]>(['name']);

  dataTable = viewChild<Table>('dataTable');
  contextMenu = viewChild<ContextMenu>('cm');
  selectedRecord: HighscoreRecord | null = null;

  isExperienceSection = computed(() => this.section() === 'experience');
  colspanEmpty = computed(() => (this.isExperienceSection() ? 8 : 6));

  contextMenuItems: MenuItem[] = [
    {
      label: 'Highscores',
      icon: 'pi pi-chart-bar',
      command: () => this.searchOnHighscores(),
    },
    {
      separator: true,
    },
    {
      label: 'Dura',
      icon: 'pi pi-search',
      command: () => this.searchOnDura(),
    },
    {
      label: 'Copy Name',
      icon: 'pi pi-copy',
      command: () => this.copyCharacterName(),
    },
  ];

  filterGlobal(value: string): void {
    this.dataTable()?.filterGlobal(value, 'contains');
  }

  formatPoints(points: number | null): string {
    if (points === null || points === undefined) {
      return '-';
    }
    return points.toLocaleString('en-US');
  }

  getGainIcon(value: number | null | undefined): string | null {
    if (!value) return null;
    return value > 0 ? 'pi pi-angle-up' : value < 0 ? 'pi pi-angle-down' : null;
  }

  // CONTEXT MENU ACTIONS
  searchOnHighscores(): void {
    if (this.selectedRecord) {
      // Implementar búsqueda en highscores
      console.log('Search on highscores:', this.selectedRecord);
    }
  }

  searchOnDura(): void {
    if (this.selectedRecord) {
      window.open(`${environment.dura.baseURL}/?characters/${this.selectedRecord.name}`, '_blank');
    }
  }

  async copyCharacterName(): Promise<void> {
    if (this.selectedRecord) {
      try {
        await navigator.clipboard.writeText(this.selectedRecord.name);
        console.log(`"${this.selectedRecord.name}" copied to clipboard`);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }
}
