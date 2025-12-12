import { Component, input, viewChild } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { HighscoreRecord } from '../../../core/models/highscore.model';
import { AbsolutValuePipe } from '../../../shared/abs-value.pipe';

import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-highscore-data-table',
  templateUrl: './highscore-data-table.component.html',
  styleUrls: ['./highscore-data-table.component.scss'],
  imports: [CommonModule, TableModule, TooltipModule, DecimalPipe, AbsolutValuePipe],
})
export class HighscoreDataTableComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<string>();
  globalFilterFields = input<string[]>(['name']);

  dataTable = viewChild<Table>('dataTable');

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
}
