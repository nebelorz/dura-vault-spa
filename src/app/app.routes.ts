import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'top/:section',
    loadComponent: () =>
      import('./features/highscore-section/highscore-section.component').then(
        (m) => m.HighscoreSectionComponent,
      ),
  },
  {
    path: 'online',
    loadComponent: () =>
      import('./features/online-activity-section/online-activity-section.component').then(
        (m) => m.OnlineActivitySectionComponent,
      ),
  },
  {
    path: 'deaths',
    loadComponent: () =>
      import('./features/deaths-section/deaths-section.component').then(
        (m) => m.DeathsSectionComponent,
      ),
  },
  {
    path: 'player/:name',
    loadComponent: () =>
      import('./features/player-detail/player-detail.component').then(
        (m) => m.PlayerDetailComponent,
      ),
  },
];
