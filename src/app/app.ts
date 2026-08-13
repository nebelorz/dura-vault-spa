import { Component, inject, DestroyRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter, fromEvent } from 'rxjs';
import { MotionOptions } from '@primeuix/motion';

import { Toast } from 'primeng/toast';
import { MessageService, PrimeTemplate } from 'primeng/api';

import { NavBarComponent } from './features/nav-bar/nav-bar.component';
import { FooterComponent } from './features/footer/footer.component';
import { ServerService } from '@core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent, Toast, PrimeTemplate],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly serverService = inject(ServerService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly toastMotionOptions: MotionOptions = {
    name: 'toast',
    safe: true,
  };

  constructor() {
    fromEvent(document, 'visibilitychange')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const favicon = document.querySelector<HTMLLinkElement>('#favicon');
        if (favicon) {
          favicon.href = document.hidden ? 'favicon-inactive.svg' : 'favicon-active.svg';
        }
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.messageService.clear());
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
