import { Component, input } from '@angular/core';

@Component({
  selector: 'app-no-data-status',
  standalone: true,
  templateUrl: './no-data-status.component.html',
  styleUrl: './no-data-status.component.scss',
})
export class NoDataStatusComponent {
  title = input<string>('No data available');
  message = input<string>('There is currently no data to display.');
}
