import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-achievement-badge',
  templateUrl: './achievement-badge.component.html',
})
export class AchievementBadgeComponent {
  gradStart = input.required<string>();
  gradEnd = input.required<string>();
  text = input.required<string>();
  path = input.required<string>();

  readonly gradId = `grad_${Math.random().toString(36).slice(2, 8)}`;
}
