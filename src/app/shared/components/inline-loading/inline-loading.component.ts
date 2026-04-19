import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'app-inline-loading',
  styleUrl: './inline-loading.component.scss',
  template: `
    <div class="inline-loading">
      <i class="pi pi-spin pi-spinner"></i>
      <span class="text-sub">Loading...</span>
    </div>
  `,
})
export class InlineLoadingComponent {}
