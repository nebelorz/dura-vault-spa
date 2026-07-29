import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-deaths-header',
  templateUrl: './deaths-header.component.html',
  styleUrl: './deaths-header.component.scss',
})
export class DeathsHeaderComponent {}
