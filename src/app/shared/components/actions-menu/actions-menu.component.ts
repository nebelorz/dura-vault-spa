import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-actions-menu',
  templateUrl: './actions-menu.component.html',
  styleUrls: ['./actions-menu.component.scss'],
  imports: [MenuModule, ButtonModule],
})
export class ActionsMenuComponent {
  items = input.required<MenuItem[]>();

  private readonly menu = viewChild.required<Menu>('menu');

  toggle(event: Event): void {
    this.menu().toggle(event);
  }
}
