import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HighscoreSection } from '../../../core/models/highscore.model';
import { PlayerHistoryInfo } from '../../../core/models/player-history.model';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MinimalistIconComponent } from '../../../shared/minimalist-icon/minimalist-icon.component';

interface SectionOption {
  label: string;
  value: HighscoreSection;
}

@Component({
  selector: 'app-player-detail-header',
  templateUrl: './player-detail-header.component.html',
  styleUrls: ['./player-detail-header.component.scss'],
  imports: [ButtonModule, SelectModule, FormsModule, MinimalistIconComponent],
})
export class PlayerDetailHeaderComponent {
  // Inputs
  playerName = input.required<string>();
  section = input.required<HighscoreSection>();
  playerInfo = input<PlayerHistoryInfo | null>(null);

  // Outputs
  backClick = output<void>();
  sectionChange = output<HighscoreSection>();

  // Section options
  readonly sectionOptions: SectionOption[] = [
    { label: 'Experience', value: 'experience' },
    { label: 'Magic', value: 'magic' },
    { label: 'Shield', value: 'shield' },
    { label: 'Distance', value: 'distance' },
    { label: 'Club', value: 'club' },
    { label: 'Sword', value: 'sword' },
    { label: 'Axe', value: 'axe' },
    { label: 'Fist', value: 'fist' },
    { label: 'Fishing', value: 'fishing' },
  ];

  onBackClick(): void {
    this.backClick.emit();
  }

  onSectionChange(newSection: HighscoreSection): void {
    this.sectionChange.emit(newSection);
  }
}
