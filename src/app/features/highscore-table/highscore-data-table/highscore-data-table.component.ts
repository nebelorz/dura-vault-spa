import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, input, viewChild, computed, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

import { HighscoreRecord } from '../../../core/models/highscore.model';
import { RemoveMinusPipe } from '../../../shared/pipes/remove-minus.pipe';

import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

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
    RemoveMinusPipe,
  ],
})
export class HighscoreDataTableComponent {
  private readonly router = inject(Router);

  // Inputs
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<string>();
  globalFilterFields = input<string[]>(['name']);

  // Computed properties
  isExperienceSection = computed(() => this.section() === 'experience');
  colspanEmpty = computed(() => (this.isExperienceSection() ? 8 : 6));

  // Childs
  private dataTable = viewChild<Table>('dataTable');

  // Context menu
  selectedRecord: HighscoreRecord | null = null;
  readonly contextMenuItems: MenuItem[] = [
    {
      label: 'Player History',
      icon: 'pi pi-chart-line',
      command: () => this.viewPlayerHistory(),
    },
    {
      separator: true,
    },
    {
      label: 'Search on Dura',
      icon: 'pi pi-search',
      command: () => this.searchOnDura(),
    },
    {
      label: 'Copy',
      icon: 'pi pi-copy',
      command: () => this.copyCharacterInfo(),
    },
  ];

  /**
   * Filters the table by the given value
   */
  filterGlobal(value: string): void {
    this.dataTable()?.filterGlobal(value, 'contains');
  }

  /**
   * Formats points with thousand separators
   */
  formatPoints(points: number | null): string {
    if (!points) return '-'; // Display dash for null/undefined points
    return points.toLocaleString('en-US');
  }

  /**
   * Returns the appropriate icon class based on the gain value
   */
  getGainIcon(value: number | null | undefined): string | null {
    if (value === null || value === undefined) return null;
    if (value > 0) return 'pi pi-angle-up';
    if (value < 0) return 'pi pi-angle-down';
    return 'pi pi-equals';
  }

  // Context Menu Actions
  private viewPlayerHistory(): void {
    const record = this.selectedRecord;
    if (!record) return;

    this.router.navigate(['/player', record.section], {
      queryParams: { name: record.name },
    });
  }

  private searchOnDura(): void {
    const record = this.selectedRecord;
    if (!record) return;

    const url = `${environment.dura.baseURL}/?characters/${record.name}`;
    window.open(url, '_blank');
  }

  private async copyCharacterInfo(): Promise<void> {
    const record = this.selectedRecord;
    if (!record) return;

    try {
      const message = this.formatCharacterInfo(record);
      await navigator.clipboard.writeText(message);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }

  /**
   * Formats character information for clipboard
   */
  private formatCharacterInfo(record: HighscoreRecord): string {
    const parts = [`Name: ${record.name}`, `Section: ${record.section}`, `Level: ${record.level}`];

    if (record.section === 'experience' && record.gain_points !== null) {
      parts.push(`Gain points: ${record.gain_points}`);
    }

    parts.push(
      `Gain level: ${record.gain_level}`,
      `Date: ${record.scrape_date}`,
      'dura-vault.vercel.app',
    );

    return parts.join(' | ');
  }
}
