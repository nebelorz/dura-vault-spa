import { Component, computed, input, signal, effect } from '@angular/core';

import { PlayerHistoryResponse } from '@core/models';
import { formatDate, formatLargeNumber } from '@shared/functions';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

interface ChartDataset {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  fill: boolean;
  borderWidth: number;
  yAxisID: string;
  pointRadius: number;
  pointHoverRadius: number;
}

@Component({
  selector: 'app-player-detail-chart',
  templateUrl: './player-detail-chart.component.html',
  styleUrls: ['./player-detail-chart.component.scss'],
  imports: [CardModule, ChartModule, LoadingStatusComponent, NoDataStatusComponent],
})
export class PlayerDetailChartComponent {
  historyData = input.required<PlayerHistoryResponse | null>();
  loading = input.required<boolean>();

  // Color signals
  private levelColor = signal<string>('');
  private pointsColor = signal<string>('');
  private readonly gridColor = 'rgba(128, 128, 128, 0.2)';

  constructor() {
    // Initialize colors after view init
    effect(
      () => {
        this.updateColors();
      },
      { allowSignalWrites: true },
    );
  }

  private updateColors(): void {
    const styles = getComputedStyle(document.documentElement);
    this.levelColor.set(styles.getPropertyValue('--p-primary-color').trim() || '#3b82f6');
    this.pointsColor.set(styles.getPropertyValue('--p-button-text-help-color').trim() || '#8b5cf6');
  }

  // Prepare chart data
  chartData = computed(() => {
    const data = this.historyData();
    if (!data?.daily?.length) return null;

    const labels = data.daily.map((record) => formatDate(record.scrape_date));
    const hasPoints = data.daily.some((record) => record.points !== null);

    const datasets: ChartDataset[] = [
      this.createDataset(
        'Level',
        data.daily.map((r) => r.level),
        this.levelColor(),
        'y',
        true,
      ),
    ];

    if (hasPoints) {
      datasets.push(
        this.createDataset(
          'Experience',
          data.daily.map((r) => r.points),
          this.pointsColor(),
          'y1',
          false,
        ),
      );
    }

    return { labels, datasets };
  });

  // Chart configuration
  chartOptions = computed(() => {
    const data = this.historyData();
    const hasPoints = data?.daily?.some((record) => record.points !== null) ?? false;

    return {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            usePointStyle: false,
            font: {
              size: 12,
              family: 'Montserrat, Arial, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 4,
          titleColor: '#fff',
          bodyColor: '#fff',
          titleFont: { family: 'Montserrat, Arial, sans-serif' },
          bodyFont: { family: 'Montserrat, Arial, sans-serif' },
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              const formattedValue =
                label === 'Experience' ? formatLargeNumber(value) : Math.floor(value).toString();
              return `${label}: ${formattedValue}`;
            },
          },
        },
      },
      scales: this.createScales(hasPoints),
    };
  });

  /**
   * Creates a chart dataset with consistent styling
   */
  private createDataset(
    label: string,
    data: (number | null)[],
    color: string,
    yAxisID: string,
    fill: boolean,
  ): ChartDataset {
    return {
      label,
      data,
      borderColor: color,
      backgroundColor: `${color}1a`,
      tension: 0.3,
      fill,
      borderWidth: 1,
      yAxisID,
      pointRadius: 3,
      pointHoverRadius: 6,
    };
  }

  /**
   * Creates scale configuration for the chart
   */
  private createScales(hasPoints: boolean): any {
    const scales: any = {
      x: {
        ticks: {
          font: { size: 11, family: 'Montserrat, Arial, sans-serif' },
          minRotation: 0,
          maxRotation: 45,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y: this.createYAxis('LEVEL', this.levelColor(), 'right', true, (value: number) =>
        Math.floor(value).toString(),
      ),
    };

    if (hasPoints) {
      scales.y1 = this.createYAxis(
        'EXPERIENCE',
        this.pointsColor(),
        'right',
        false,
        (value: number) => formatLargeNumber(value),
      );
    }

    return scales;
  }

  /**
   * Creates a Y-axis configuration
   */
  private createYAxis(
    title: string,
    color: string,
    position: 'left' | 'right',
    drawGridOnChart: boolean,
    tickCallback: (value: number) => string,
  ): any {
    const config: any = {
      type: 'linear',
      display: true,
      position,
      ticks: {
        color,
        font: { size: 10, family: 'Montserrat, Arial, sans-serif' },
        callback: tickCallback,
      },
      grid: {
        drawOnChartArea: drawGridOnChart,
        color: this.gridColor,
      },
      title: {
        display: true,
        text: title,
        color: `${color}6a`,
        font: {
          size: 11,
          weight: 'bold',
          family: 'Montserrat, Arial, sans-serif',
        },
      },
    };

    // stepSize of 1 to avoid repeated values
    if (title === 'LEVEL') {
      config.ticks.stepSize = 1;
    }

    return config;
  }
}
