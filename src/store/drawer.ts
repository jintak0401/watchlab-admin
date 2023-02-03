import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const DRAWER_KEY = 'drawer';

export interface DrawerAtom {
  drawerOpened: boolean;
  openedItems: string[];
}

const _drawerAtom = atomWithStorage<DrawerAtom>(DRAWER_KEY, {
  drawerOpened: true,
  openedItems: [],
});

export const drawerAtom = atom(
  (get) => get(_drawerAtom),
  (get, set, update: Partial<DrawerAtom>) => {
    set(_drawerAtom, { ...get(_drawerAtom), ...update });
  }
);
