import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingCarouselComponent } from './landing-carousel/landing-carousel.component';
import { DevInfoPanelComponent } from './dev-info-panel/dev-info-panel.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [CommonModule, LandingCarouselComponent, DevInfoPanelComponent],
})
export class LandingPageComponent {
  protected readonly darkMode = inject(ThemeService).darkMode;
}
