import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = '/tmp/real-good-denver-cache';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function cacheKey(key: string): string {
  return crypto.createHash('md5').update(key).digest('hex');
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function getCached<T>(key: string): T | null {
  try {
    ensureCacheDir();
    const file = path.join(CACHE_DIR, `${cacheKey(key)}.json`);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf-8');
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > TTL_MS) {
      fs.unlinkSync(file);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const file = path.join(CACHE_DIR, `${cacheKey(key)}.json`);
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    fs.writeFileSync(file, JSON.stringify(entry), 'utf-8');
  } catch {
    // Cache write failure is non-fatal
  }
}
