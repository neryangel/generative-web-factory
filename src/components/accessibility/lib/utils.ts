/**
 * Internal utility — class name merger
 * Replaces @/shared/lib cn() for module independence.
 *
 * @module accessibility/lib/utils
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
