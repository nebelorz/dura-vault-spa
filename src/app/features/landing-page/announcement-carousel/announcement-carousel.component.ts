import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '@core/services';

type CarouselItemType = 'coffee';

interface CarouselItem {
  type: CarouselItemType;
  title?: string;
  description?: string;
  coffeeUrl?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-announcement-carousel',
  templateUrl: './announcement-carousel.component.html',
  styleUrls: ['./announcement-carousel.component.scss'],
  imports: [CarouselModule, ButtonModule],
})
export class AnnouncementCarouselComponent {
  private readonly darkMode = inject(ThemeService).darkMode;

  protected readonly bmcLogoSrc = computed(() =>
    this.darkMode() ? 'bmc-logo-dark-mode.svg' : 'bmc-logo-light-mode.svg',
  );

  protected readonly carouselItems: CarouselItem[] = [
    {
      type: 'coffee',
      title: 'Want to help Dura Vault grow?',
      description:
        "Dura Vault is an open-source project created with love. I'm committed to keeping it clean and useful above anything.\n\nIf you’re finding it helpful, a small coffee would go a long way in supporting further development.\n\nThanks for being part of the community <3",
      coffeeUrl: 'https://buymeacoffee.com/nebelorz',
    },
  ];
}
