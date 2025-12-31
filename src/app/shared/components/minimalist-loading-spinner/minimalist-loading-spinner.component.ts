import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minimalist-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minimalist-loading-spinner.component.html',
  styleUrls: ['./minimalist-loading-spinner.component.scss'],
})
export class MinimalistLoadingSpinnerComponent {
  loading = input.required<boolean>();
  size = input<string>('small');
}
