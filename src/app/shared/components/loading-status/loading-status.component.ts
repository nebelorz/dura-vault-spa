import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-status',
  templateUrl: './loading-status.component.html',
  styleUrl: './loading-status.component.scss',
})
export class LoadingStatusComponent {}
