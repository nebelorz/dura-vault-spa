import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { version } from '../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [CommonModule, ButtonModule],
})
export class FooterComponent {
  version = `v${version}`;
  currentYear = new Date().getFullYear();
  githubUrl = 'https://github.com/nebelorz';
}
