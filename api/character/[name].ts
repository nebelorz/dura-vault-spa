import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  extractField,
  parseAccountCreated,
  parseBanishedUntil,
  parseCharacters,
  parseDeaths,
  parseFormerNames,
  parseGuild,
  parseHouses,
  toISO,
} from './parse';

const NAME_REGEX = /^[a-zA-Z\s']{1,50}$/;
const DURA_CLASSIC_URL = process.env['DURA_BASE_URL'] ?? 'https://classic.dura-online.com';
const DURA_SEASONAL_URL = process.env['DURA_SEASONAL_BASE_URL'] ?? 'https://aetas.playdura.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { name, server } = req.query;
  const raw = Array.isArray(name) ? name[0] : name;
  const playerName = raw?.replace(/\+/g, ' ');

  if (!playerName || !NAME_REGEX.test(playerName)) {
    return res.status(400).json({ error: 'INVALID_NAME' });
  }

  const serverParam = Array.isArray(server) ? server[0] : server;
  if (serverParam !== undefined && serverParam !== 'classic' && serverParam !== 'seasonal') {
    return res.status(400).json({ error: 'INVALID_SERVER' });
  }
  const duraUrl = serverParam === 'seasonal' ? DURA_SEASONAL_URL : DURA_CLASSIC_URL;
  const url = `${duraUrl}/?characters/${encodeURIComponent(playerName)}`;

  let html: string;
  try {
    const upstream = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        Referer: duraUrl + '/',
      },
    });
    html = await upstream.text();
  } catch {
    return res.status(502).json({ error: 'UPSTREAM_UNAVAILABLE' });
  }

  const levelStr = extractField(html, 'Level');
  const data = {
    characterInformation: {
      name: extractField(html, 'Name'),
      formerNames: parseFormerNames(html),
      sex: extractField(html, 'Sex'),
      profession: extractField(html, 'Profession'),
      level: levelStr ? parseInt(levelStr) : null,
      residence: extractField(html, 'Residence'),
      guild: parseGuild(html),
      lastLogin: toISO(extractField(html, 'Last login')),
      created: toISO(extractField(html, 'Created')),
    },
    houses: parseHouses(html),
    deaths: parseDeaths(html),
    accountInformation: {
      created: toISO(parseAccountCreated(html)),
      banishedUntil: toISO(parseBanishedUntil(html)),
      status: extractField(html, 'Position'),
    },
    characters: parseCharacters(html),
  };

  if (!data.characterInformation.name) {
    console.error('[character-api] name not found', { url, htmlLength: html.length });
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  return res.status(200).json(data);
}
