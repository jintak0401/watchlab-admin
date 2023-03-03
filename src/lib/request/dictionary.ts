import Router from 'next/router';

import _axios from '@/lib/axiosInstance';
import { WordType } from '@/lib/types';

import { redirectIfUnauthorized } from './index';

const dictionaryReqUrl = (locale?: string) => {
  return `/${locale}/dictionary`;
};

export const getDictionaries = async (locale = Router.locale) => {
  const url = dictionaryReqUrl(locale);
  const res = await redirectIfUnauthorized(() => _axios.get(url));
  return res?.data;
};

export const addDictionary = async (word: WordType, locale = Router.locale) => {
  const url = dictionaryReqUrl(locale);
  const res = await redirectIfUnauthorized(() =>
    _axios.post<WordType>(url, word)
  );
  return res?.data;
};

export const updateDictionary = async (
  { word, description }: WordType,
  id: number,
  locale = Router.locale
) => {
  const url = `${dictionaryReqUrl(locale)}/${id}`;
  const res = await redirectIfUnauthorized(() =>
    _axios.put<WordType>(url, {
      word,
      description,
    })
  );
  return res?.data;
};

export const deleteDictionary = async (id: number, locale = Router.locale) => {
  const url = `${dictionaryReqUrl(locale)}/${id}`;
  const res = await redirectIfUnauthorized(() => _axios.delete(url));
  return res?.data;
};
