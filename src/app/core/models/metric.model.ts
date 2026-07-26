/** Highscore section metrics (experience sections) */
export type HighscoreMetricType = 'level' | 'experience' | 'rank' | 'skill';

/** Online activity section metrics */
export type OnlineMetricType = 'online_time' | 'online_avg' | 'online_days';

/** Deaths section text columns */
export type DeathMetricType = 'killer_name' | 'death_time';

/** Combined metric type for the shared rendering pipeline */
export type MetricType = HighscoreMetricType | OnlineMetricType | DeathMetricType;

/** Definition shape for a metric display.
 *  `gain`/`loss`/`cssClassGain`/`cssClassLoss` are optional —
 *  text-only metrics (e.g. `killer_name`) omit them entirely. */
export interface MetricDefinition {
  gain?: string;
  loss?: string;
  cssClassGain?: string;
  cssClassLoss?: string;
  label: string;
  shortLabel: string;
}
