import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyTopGainersComponent } from './daily-top-gainers/daily-top-gainers.component';
import { DevInfoPanelComponent } from './dev-info-panel/dev-info-panel.component';
import { LandingCarouselComponent } from './landing-carousel/landing-carousel.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [
    CommonModule,
    LandingCarouselComponent,
    DevInfoPanelComponent,
    DailyTopGainersComponent,
  ],
})
export class LandingPageComponent {
  protected readonly darkMode = inject(ThemeService).darkMode;
}
