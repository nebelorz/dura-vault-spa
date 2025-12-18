import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  imports: [InputTextModule, FloatLabelModule],
})
export class SearchBoxComponent {
  private router: Router = inject(Router);

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const capitalizedQuery = this.capitalizePlayerName(input.value);

    if (capitalizedQuery) {
      this.router.navigate(['/player/experience'], {
        queryParams: { name: capitalizedQuery },
      });

      input.value = '';
    }
  }

  /**
   * Capitalizes each word in the player name
   * Example: "gryn djinn" -> "Gryn Djinn"
   */
  private capitalizePlayerName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
