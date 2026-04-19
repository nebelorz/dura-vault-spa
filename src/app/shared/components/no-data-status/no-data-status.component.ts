import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-no-data-status',
  templateUrl: './no-data-status.component.html',
  styleUrl: './no-data-status.component.scss',
})
export class NoDataStatusComponent {
  title = input<string>('No data available');
  message = input<string>('There is currently no data on the vault to display');
}
