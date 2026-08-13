import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { App } from './app';

function stubMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  });
}

// Mirrors the headless toast template in src/app/app.html; keep in sync.
@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [Toast, PrimeTemplate],
  template: `
    <p-toast position="bottom-right">
      <ng-template pTemplate="headless" let-message let-closeFn="closeFn">
        <div class="toast-message toast-{{ message.severity }}">
          <div class="toast-content">
            @if (message.summary) {
              <div class="toast-summary text-value">{{ message.summary }}</div>
            }
            <div class="toast-detail text-standard">{{ message.detail }}</div>
          </div>
          <button class="toast-close" (click)="closeFn($event)" aria-label="Close">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </ng-template>
    </p-toast>
  `,
})
class ToastHostComponent {}

describe('App', () => {
  beforeEach(async () => {
    stubMatchMedia();
    await TestBed.configureTestingModule({
      imports: [App, ToastHostComponent],
      providers: [MessageService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders the custom headless toast template instead of the PrimeNG default', async () => {
    const fixture = TestBed.createComponent(ToastHostComponent);
    const messageService = TestBed.inject(MessageService);
    fixture.detectChanges();

    messageService.add({ severity: 'success', summary: 'Done', detail: 'Saved' });
    await fixture.whenStable();
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('.toast-message');
    expect(toast).toBeTruthy();
    expect(toast.classList).toContain('toast-success');
    expect(toast.textContent).toContain('Done');
    expect(fixture.nativeElement.querySelector('.p-toast-message-icon')).toBeNull();
  });
});
