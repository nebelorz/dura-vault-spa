import { environment } from '@env';
import type { ServerId } from '@core/constants';

function getBaseURL(server: ServerId): string {
  return server === 'seasonal'
    ? environment.seasonal.dura.baseURL
    : environment.classic.dura.baseURL;
}

export function getDuraHomeUrl(server: ServerId = 'classic'): string {
  return `${getBaseURL(server)}/`;
}

export function getDuraPlayerUrl(name: string, server: ServerId = 'classic'): string {
  return `${getBaseURL(server)}/?characters/${name}`;
}

export function getDuraGuildUrl(name: string, server: ServerId = 'classic'): string {
  return `${getBaseURL(server)}/?guilds/${name}`;
}
