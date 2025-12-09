import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent {
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim().replace(/\s+/g, '+');

    if (query) {
      window.open(`${environment.baseUrl}/?characters/${query}`, '_blank');
    }
  }
}
