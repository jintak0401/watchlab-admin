import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const USER_INFO_KEY = 'userInfo';

export interface UserInfoAtom {
  name: string;
  image: string;
  role: string;
}

const _userInfoAtom = atomWithStorage<UserInfoAtom>(USER_INFO_KEY, {
  name: '',
  image: '',
  role: '',
});

export const userInfoAtom = atom(
  (get) => get(_userInfoAtom),
  (get, set, update: Partial<UserInfoAtom>) => {
    set(_userInfoAtom, { ...get(_userInfoAtom), ...update });
  }
);
