import { Component, computed } from '@angular/core';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly version = `v${version}`;
  readonly currentYear = computed(() => new Date().getFullYear());
  readonly discordUrl = 'https://discord.com/users/neBelorz%238759';
  readonly githubUrl = 'https://github.com/nebelorz/dura-vault-spa';
}
