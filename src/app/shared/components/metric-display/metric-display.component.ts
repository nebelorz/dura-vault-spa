import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

import { METRIC_DEFINITIONS, MetricType } from '@core/constants';
import { formatNumber } from '@shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-metric-display',
  imports: [NgClass, TooltipModule],
  templateUrl: './metric-display.component.html',
  styleUrl: './metric-display.component.scss',
})
export class MetricDisplayComponent {
  // REQUIRED INPUTS
  metric = input.required<MetricType>();
  layout = input.required<'row' | 'column'>();

  // OPTIONAL INPUTS
  value = input<number>(); // if undefined, value element won't render
  subValue = input<string>();
  relativePercentagePointsFromTotal = input<number>();
  displayValue = input<string>(); // overrides formatted value

  // VISIBILITY INPUTS
  showIcon = input<boolean>(true);
  showLabel = input<boolean>(false);
  showShortLabel = input<boolean>(false);
  abbreviate = input<boolean>(true);
  showSign = input<boolean>(false);

  // TOOLTIP INPUTS
  iconTooltip = input<string>();
  valueTooltip = input<string>();
  labelTooltip = input<string>();
  subValueTooltip = input<string>();
  tooltipPosition = input<string>('top'); // global position for all tooltips

  protected readonly isLoss = computed(() => {
    const value = this.value();
    return value !== undefined && value < 0;
  });

  protected readonly metricDef = computed(() => METRIC_DEFINITIONS[this.metric()]);

  protected readonly iconClass = computed(() =>
    this.isLoss() ? this.metricDef().loss : this.metricDef().gain,
  );

  protected readonly colorClass = computed(() =>
    this.isLoss() ? this.metricDef().cssClassLoss : this.metricDef().cssClassGain,
  );

  protected readonly formattedValue = computed<string | undefined>(() => {
    const override = this.displayValue();
    if (override !== undefined) return override;
    const value = this.value();
    if (value === undefined) return undefined;
    const formatted = this.abbreviate() ? formatNumber(Math.abs(value)) : String(Math.abs(value));
    let prefix = '';
    if (this.showSign()) {
      if (value > 0) prefix = '+';
      else if (value < 0) prefix = '-';
    }
    return prefix + formatted;
  });

  protected readonly percentLabel = computed<string | undefined>(() => {
    const total = this.relativePercentagePointsFromTotal();
    const value = this.value();
    if (total == null || total <= 0 || value === undefined) return undefined;
    return `${((Math.abs(value) / total) * 100).toFixed(2)}%`;
  });

  protected readonly resolvedSubValue = computed<string | undefined>(
    () => this.subValue() ?? this.percentLabel(),
  );
}
