import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-error-status',
  templateUrl: './error-status.component.html',
  styleUrl: './error-status.component.scss',
})
export class ErrorStatusComponent {
  title = input<string>('Something went wrong');
  message = input<string>('The data could not be loaded. Please try again.');
  disabled = input(false);
  retry = output<void>();
}
