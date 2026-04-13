import type { VercelRequest, VercelResponse } from '@vercel/node';

const NAME_REGEX = /^[a-zA-Z\s']{1,50}$/;
const DURA_URL = process.env['DURA_BASE_URL'] ?? 'https://classic.dura-online.com';

function extractField(html: string, field: string): string | null {
  const re = new RegExp(
    `<td[^>]*>${field}:</td>\\s*<td[^>]*>(?:<span[^>]*>)?(?:<b>)?([^<\\[\\n]+?)(?:</b>)?(?:</span>)?(?:\\s*\\[|</td>)`,
    'i',
  );
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function parseDeaths(html: string): { date: string; description: string; killers: string[] }[] {
  const start = html.indexOf('<!-- DEATHS -->');
  const end = html.indexOf('<!-- DEATHS_END -->');
  if (start === -1 || end === -1) return [];
  const slice = html.slice(start, end);
  const re = /<tr[^>]*>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>([\s\S]+?)<\/td>/g;
  const deaths: { date: string; description: string; killers: string[] }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(slice)) !== null) {
    const desc = m[2].replace(/<[^>]+>/g, '').trim();
    if (desc && !desc.includes('Character Deaths')) {
      const killerRe = /href="[^"]*\?characters\/([^"]+)"/g;
      const killers: string[] = [];
      let km: RegExpExecArray | null;
      while ((km = killerRe.exec(m[2])) !== null) {
        killers.push(decodeURIComponent(km[1].replace(/\+/g, ' ')));
      }
      deaths.push({ date: m[1].trim(), description: desc, killers });
    }
  }
  return deaths;
}

function parseHouses(
  html: string,
): { name: string; rent: string; size: string; beds: string; dueDate: string }[] {
  const start = html.indexOf('<!-- HOUSES -->');
  const end = html.indexOf('<!-- HOUSES_END -->');
  if (start === -1 || end === -1) return [];
  const slice = html.slice(start, end);
  const houses: { name: string; rent: string; size: string; beds: string; dueDate: string }[] = [];
  const rowRe = /<tr[^>]*bgcolor[^>]*>([\s\S]+?)<\/tr>/g;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(slice)) !== null) {
    const cells = [...m[1].matchAll(/<td[^>]*>([^<]+)<\/td>/g)].map((c) => c[1].trim());
    if (cells.length === 5 && cells[0] !== 'Name') {
      houses.push({
        name: cells[0],
        rent: cells[1],
        size: cells[2],
        beds: cells[3],
        dueDate: cells[4],
      });
    }
  }
  return houses;
}

function parseAccountChars(
  html: string,
): { name: string; level: number | null; vocation: string | null }[] {
  const start = html.indexOf('<!-- CHARACTERS_LIST -->');
  const end = html.indexOf('<!-- CHARACTERS_LIST_END -->');
  if (start === -1 || end === -1) return [];
  const slice = html.slice(start, end);
  const chars: { name: string; level: number | null; vocation: string | null }[] = [];
  const re = /<nobr>\d+\.&#160;([^<]+)<\/nobr>[\s\S]*?<td>(\d+)\s+([^<]+)<\/td>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(slice)) !== null) {
    chars.push({ name: m[1].trim(), level: parseInt(m[2]), vocation: m[3].trim() });
  }
  return chars;
}

function parseAccountCreated(html: string): string | null {
  const start = html.indexOf('<!-- ACCOUNT_INFORMATION -->');
  const end = html.indexOf('<!-- ACCOUNT_INFORMATION_END -->');
  if (start === -1 || end === -1) return null;
  const slice = html.slice(start, end);
  const m = slice.match(/<td[^>]*>Created:<\/td>\s*<td[^>]*>\s*([^\n<[]+)/i);
  return m ? m[1].trim() : null;
}

function parseBanishedUntil(html: string): string | null {
  const start = html.indexOf('<!-- ACCOUNT_INFORMATION -->');
  const end = html.indexOf('<!-- ACCOUNT_INFORMATION_END -->');
  if (start === -1 || end === -1) return null;
  const slice = html.slice(start, end);
  const m = slice.match(/\[Banished until ([^\]]+)\]/i);
  return m ? m[1].trim() : null;
}

function parseFormerNames(html: string): string[] {
  const m = html.match(/\[Former Name\(s\):\s*([^\]]+)\]/i);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;
  const raw = Array.isArray(name) ? name[0] : name;
  const playerName = raw?.replace(/\+/g, ' ');

  if (!playerName || !NAME_REGEX.test(playerName)) {
    return res.status(400).json({ error: 'INVALID_NAME' });
  }

  const url = `${DURA_URL}/?characters/${encodeURIComponent(playerName)}`;

  let html: string;
  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        Referer: DURA_URL + '/',
      },
    });
    html = await upstream.text();
  } catch {
    return res.status(502).json({ error: 'UPSTREAM_UNAVAILABLE' });
  }

  const levelStr = extractField(html, 'Level');
  const data = {
    name: extractField(html, 'Name'),
    formerNames: parseFormerNames(html),
    sex: extractField(html, 'Sex'),
    profession: extractField(html, 'Profession'),
    level: levelStr ? parseInt(levelStr) : null,
    residence: extractField(html, 'Residence'),
    lastLogin: extractField(html, 'Last login'),
    created: extractField(html, 'Created'),
    houses: parseHouses(html),
    deaths: parseDeaths(html),
    accountCreated: parseAccountCreated(html),
    banishedUntil: parseBanishedUntil(html),
    accountCharacters: parseAccountChars(html),
  };

  if (!data.name) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  return res.status(200).json(data);
}
