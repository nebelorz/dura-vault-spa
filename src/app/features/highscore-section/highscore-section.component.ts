import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HighscoreRecord, Section, ScrapeDateRange, TimePeriod } from '@core/models';
import { HighscoreService, MetadataService, ServerService } from '@core/services';
import { onServerSwitch, resolvePeriodRange } from '@shared/functions';
import { DatePipe } from '@angular/common';
import { HighscoreDataTableComponent } from './highscore-left-section/highscore-data-table/highscore-data-table.component';
import { HighscoreHeaderComponent } from './highscore-header/highscore-header.component';
import { HighscoreChartGainsByVocationComponent } from './highscore-right-section/highscore-chart-gains-by-vocation/highscore-chart-gains-by-vocation.component';
import { HighscoreTopPerVocationCardsComponent } from './highscore-right-section/highscore-top-by-vocation-cards/highscore-top-by-vocation-cards.component';
import { PeriodSelectorComponent } from '@shared/components';

@Component({
  selector: 'app-highscore-section',
  templateUrl: './highscore-section.component.html',
  styleUrl: './highscore-section.component.scss',
  imports: [
    HighscoreHeaderComponent,
    PeriodSelectorComponent,
    HighscoreDataTableComponent,
    HighscoreChartGainsByVocationComponent,
    HighscoreTopPerVocationCardsComponent,
    DatePipe,
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
  window = computed(() => {
    const period = this.selectedPeriod();
    const range = this.scrapeDateRange();
    if (!range) return null;
    const maxDate = range.max_scrape_date;
    if (!maxDate) return null;
    return resolvePeriodRange(period, range.min_scrape_date ?? null, maxDate);
  });

  // Display date range for the label (keeps the existing string[] shape)
  dateRange = computed<string[]>(() => {
    const w = this.window();
    if (!w) return [];
    if (w.from === w.to) return [w.from];
    return [w.from, w.to];
  });

  constructor() {
    onServerSwitch(this.serverService, () => {
      void this.loadScrapeDateRange();
      void this.loadData();
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
        limit: this.serverService.responsePlayerLimit(),
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
