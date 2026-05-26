import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  imports: [NgTemplateOutlet, RouterLink, TooltipModule],
})
export class StatCardComponent {
  icon = input<string>();
  value = input.required<string>();
  label = input.required<string>();
  sublabel = input<string>();
  accentColor = input<string>();
  sublabelColor = input<string>();
  muted = input<boolean>(false);
  tooltip = input<string>();
  link = input<string[]>();
  queryParams = input<Record<string, string>>();
}
