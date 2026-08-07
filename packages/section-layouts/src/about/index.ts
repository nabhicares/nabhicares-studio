import { Layout01 } from './Layout01';
import { Layout02 } from './Layout02';
import { Layout03 } from './Layout03';
import { Layout04 } from './Layout04';
import { Layout05 } from './Layout05';
import { Layout06 } from './Layout06';
import { Layout07 } from './Layout07';
import { Layout08 } from './Layout08';
import { Layout09 } from './Layout09';
import { Layout10 } from './Layout10';
import type { LayoutComponent } from '../types';

export const layouts: Record<number, LayoutComponent> = {
  1: Layout01,
  2: Layout02,
  3: Layout03,
  4: Layout04,
  5: Layout05,
  6: Layout06,
  7: Layout07,
  8: Layout08,
  9: Layout09,
  10: Layout10,
};

export function getLayout(version: number): LayoutComponent | undefined {
  return layouts[version];
}
