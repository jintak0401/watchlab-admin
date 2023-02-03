import metadata from 'data/metadata';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const LANG_KEY = 'lang';

const _langAtom = atomWithStorage<(typeof metadata.lang)[number]>(
  LANG_KEY,
  'en'
);

export const langAtom = atom(
  (get) => get(_langAtom),
  (_, set, update: (typeof metadata.lang)[number]) => {
    set(_langAtom, update);
  }
);
