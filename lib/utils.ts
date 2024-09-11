import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SALT_LENGTH = 16;
const HASH_ALGORITHM = 'sha256';
const ITERATIONS = 10000;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM)
    .toString('hex');
  return `${salt}:${hash}`;
}

export function comparePassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const hashToCompare = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM)
    .toString('hex');
  return hash === hashToCompare;
}
