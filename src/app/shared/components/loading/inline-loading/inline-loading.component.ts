import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-inline-loading',
  templateUrl: './inline-loading.component.html',
  styleUrl: './inline-loading.component.scss',
})
export class InlineLoadingComponent {
  message = input<string>('Loading...');
}
