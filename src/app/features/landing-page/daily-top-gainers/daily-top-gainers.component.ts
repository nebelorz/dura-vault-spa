import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { DailyTopPlayer, SectionData } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

import { CarouselModule } from 'primeng/carousel';
import { Tooltip } from 'primeng/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-daily-top-gainers',
  templateUrl: './daily-top-gainers.component.html',
  styleUrls: ['./daily-top-gainers.component.scss'],
  imports: [
    DatePipe,
    UpperCasePipe,
    CarouselModule,
    AbbreviateNumberPipe,
    Tooltip,
    LoadingStatusComponent,
    NoDataStatusComponent,
  ],
})
export class DailyTopGainersComponent {
  private readonly router = inject(Router);

  // Inputs
  loading = input.required<boolean>();
  maxDate = input<string | null>(null);
  experiencePlayers = input<DailyTopPlayer[]>([]);
  experienceLossPlayer = input<DailyTopPlayer | null>(null);
  skillsSection = input<SectionData[]>([]);

  navigateToPlayer(playerName: string, section: string): void {
    this.router.navigate(['/player', playerName], {
      queryParams: { section },
    });
  }
}
