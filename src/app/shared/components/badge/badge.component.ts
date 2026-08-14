import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant =
  | 'danger'
  | 'warn'
  | 'level'
  | 'skill'
  | 'xp'
  | 'info'
  | 'rank'
  | 'secondary-light';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  text = input.required<string>();
  variant = input<BadgeVariant>('secondary-light');
}
