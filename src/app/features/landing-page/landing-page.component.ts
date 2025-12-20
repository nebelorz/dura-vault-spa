import { Component } from '@angular/core';

import { LandingCarouselComponent } from './landing-carousel/landing-carousel.component';
import { DevInfoPanelComponent } from './dev-info-panel/dev-info-panel.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  imports: [LandingCarouselComponent, DevInfoPanelComponent],
})
export class LandingPageComponent {}
