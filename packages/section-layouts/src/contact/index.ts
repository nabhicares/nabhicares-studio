import { Layout01 } from './Layout01';
import type { LayoutComponent } from '../types';

/** Contact only ships layout-01 for now; other versions fall back to 01. */
export const layouts: Record<number, LayoutComponent> = {
  1: Layout01,
  2: Layout01,
  3: Layout01,
  4: Layout01,
  5: Layout01,
  6: Layout01,
  7: Layout01,
  8: Layout01,
  9: Layout01,
  10: Layout01,
};

export function getLayout(version: number): LayoutComponent | undefined {
  return layouts[version];
}
