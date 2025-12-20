import { Component, signal } from '@angular/core';

import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

interface CarouselItem {
  title?: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-landing-carousel',
  templateUrl: './landing-carousel.component.html',
  styleUrls: ['./landing-carousel.component.scss'],
  imports: [CarouselModule, ButtonModule],
})
export class LandingCarouselComponent {
  carouselItems = signal<CarouselItem[]>([
    {
      title: 'Hosting an event?',
      description: 'Drop a message and get it featured here',
      icon: 'pi pi-calendar',
    },
  ]);
}
