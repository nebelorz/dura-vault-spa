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
import {
  DateRangeLabelComponent,
  ErrorStatusComponent,
  PeriodSelectorComponent,
} from '@shared/components';
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
    ErrorStatusComponent,
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
  error = signal<boolean>(false);
  loading = signal<boolean>(true);
  retrying = signal<boolean>(false);
  scrapeDateRange = signal<ScrapeDateRange | null>(null);
  private scrapeError = signal<boolean>(false);
  section = signal<Section>('experience');
  selectedPeriod = signal<TimePeriod>('day');

  private dataRequestId = 0;

  // Single period window shared by the data requests and the label
  private readonly periodWindow = createPeriodWindow(this.selectedPeriod, this.scrapeDateRange);
  window = this.periodWindow.window;
  dateRange = this.periodWindow.dateRange;

  constructor() {
    onServerSwitch(this.serverService, async () => {
      if (await this.loadScrapeDateRange()) {
        await this.loadData();
      }
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

  async retry(): Promise<void> {
    if (this.retrying()) return;
    this.retrying.set(true);
    try {
      if (await this.loadScrapeDateRange()) {
        await this.loadData();
      }
    } finally {
      this.retrying.set(false);
    }
  }

  private async loadScrapeDateRange(): Promise<boolean> {
    const result = await this.metadataService.getScrapeDates('highscore_top', false);
    if (result.status === 'error') {
      this.scrapeError.set(true);
      this.error.set(true);
      return false;
    }
    this.scrapeError.set(false);
    this.scrapeDateRange.set(result.range);
    return true;
  }

  async loadData(): Promise<void> {
    const requestId = ++this.dataRequestId;
    const window = this.window();
    if (!window) {
      this.error.set(this.scrapeError());
      this.loading.set(false);
      this.data.set([]);
      return;
    }

    this.error.set(false);
    this.loading.set(true);
    this.data.set([]);

    try {
      const result = await this.highscoreService.getTopGainers(
        {
          from: window.from,
          to: window.to,
          section: this.section(),
        },
        false,
      );

      if (requestId !== this.dataRequestId) return;
      this.error.set(result === null);
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
