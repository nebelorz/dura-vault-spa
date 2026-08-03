import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { provideRouter, UrlSerializer } from '@angular/router';
import { routes } from './app.routes';
import { ServerAwareUrlSerializer } from '@core/services';

import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: UrlSerializer, useClass: ServerAwareUrlSerializer },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          primary: 'emerald',
          darkModeSelector: '.darkmode',
        },
      },
    }),
  ],
};
