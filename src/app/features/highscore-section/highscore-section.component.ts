import {
  Component,
  OnInit,
  signal,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HighscoreRecord, Section, ScrapeDateRange, TimePeriod } from '@core/models';
import { HighscoreService, MetadataService, ServerService } from '@core/services';
import { createPeriodWindow, onServerSwitch } from '@shared/functions';
import { DateRangeLabelComponent, PeriodSelectorComponent } from '@shared/components';
import { HighscoreDataTableComponent } from './highscore-left-section/highscore-data-table/highscore-data-table.component';
import { HighscoreHeaderComponent } from './highscore-header/highscore-header.component';
import { HighscoreChartGainsByVocationComponent } from './highscore-right-section/highscore-chart-gains-by-vocation/highscore-chart-gains-by-vocation.component';
import { HighscoreTopPerVocationCardsComponent } from './highscore-right-section/highscore-top-by-vocation-cards/highscore-top-by-vocation-cards.component';

@Component({
  selector: 'app-highscore-section',
  templateUrl: './highscore-section.component.html',
  imports: [
    HighscoreHeaderComponent,
    PeriodSelectorComponent,
    DateRangeLabelComponent,
    HighscoreDataTableComponent,
    HighscoreChartGainsByVocationComponent,
    HighscoreTopPerVocationCardsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HighscoreSectionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly highscoreService = inject(HighscoreService);
  private readonly metadataService = inject(MetadataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly serverService = inject(ServerService);

  // State
  data = signal<HighscoreRecord[]>([]);
  loading = signal<boolean>(true);
  scrapeDateRange = signal<ScrapeDateRange | null>(null);
  section = signal<Section>('experience');
  selectedPeriod = signal<TimePeriod>('day');

  private dataRequestId = 0;

  // Single period window shared by the data requests and the label
  private readonly periodWindow = createPeriodWindow(this.selectedPeriod, this.scrapeDateRange);
  window = this.periodWindow.window;
  dateRange = this.periodWindow.dateRange;

  constructor() {
    onServerSwitch(this.serverService, async () => {
      await this.loadScrapeDateRange();
      await this.loadData();
    });
  }

  async ngOnInit(): Promise<void> {
    // Load metadata
    await this.loadScrapeDateRange();

    // Route changes
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const section = params['section'] as Section;
      if (section) {
        this.section.set(section);
        this.loadData();
      }
    });
  }

  onPeriodChange(period: TimePeriod): void {
    this.selectedPeriod.set(period);
    this.loadData();
  }

  private async loadScrapeDateRange(): Promise<void> {
    const dateRange = await this.metadataService.getScrapeDates('highscore_top');
    if (dateRange) {
      this.scrapeDateRange.set(dateRange);
    }
  }

  private async loadData(): Promise<void> {
    const requestId = ++this.dataRequestId;
    const window = this.window();
    if (!window) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.data.set([]);

    try {
      const result = await this.highscoreService.getTopGainers({
        from: window.from,
        to: window.to,
        section: this.section(),
      });

      if (requestId !== this.dataRequestId) return;
      if (result) {
        this.data.set(result);
      }
    } finally {
      if (requestId === this.dataRequestId) {
        this.loading.set(false);
      }
    }
  }
}
