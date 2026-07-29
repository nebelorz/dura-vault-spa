import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { fromEvent } from 'rxjs';

import { NavBarComponent } from './features/nav-bar/nav-bar.component';
import { FooterComponent } from './features/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ServerService } from '@core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly serverService = inject(ServerService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const favicon = document.querySelector<HTMLLinkElement>('#favicon');
        if (favicon) {
          favicon.href = document.hidden ? 'favicon-inactive.svg' : 'favicon-active.svg';
        }
      });
  }

  ngOnInit(): void {
    // Apply server from the initial URL (page-load from a shared link).
    // Delayed to ngOnInit to guarantee the Router has completed its initial navigation.
    this.applyServerFromCurrentUrl();
  }

  private applyServerFromCurrentUrl(): void {
    const params = new URLSearchParams(window.location.search);
    this.serverService.applyServerFromQueryParam(params.get('server'));
  }
}
