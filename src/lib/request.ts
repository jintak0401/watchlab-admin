import axios, { AxiosPromise, HttpStatusCode } from 'axios';
import Router from 'next/router';

import _axios from '@/lib/axiosInstance';
import { LOGIN_PAGE_URL } from '@/lib/constant';
import { WordType } from '@/lib/types';

const dictionaryReqUrl = (locale?: string) => {
  return `/${locale}/dictionary`;
};

export const redirectIfUnauthorized = async (request: () => AxiosPromise) => {
  try {
    return await request();
  } catch (e) {
    if (
      axios.isAxiosError(e) &&
      e.response?.status === HttpStatusCode.Unauthorized
    ) {
      Router.replace(LOGIN_PAGE_URL).then(() => {
        window.alert('Login disabled. Please login again.');
      });
    } else {
      console.error('Unexpected Error: ', e);
      window.alert('Unexpected Error: ' + e);
    }
    throw e;
  }
};

export const refreshTokens = async (refreshToken: string | null) => {
  return axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};

export const getDictionaries = async (locale?: string) => {
  const url = dictionaryReqUrl(locale || 'en');
  const res = await redirectIfUnauthorized(() => _axios.get(url));
  return res?.data;
};

export const addDictionary = async (
  word: Pick<WordType, 'word' | 'description'>,
  locale?: string
) => {
  const url = dictionaryReqUrl(locale || 'en');
  const res = await redirectIfUnauthorized(() =>
    _axios.post<WordType>(url, word)
  );
  return res?.data as WordType;
};

export const updateDictionary = async (
  { word, description }: WordType,
  id: number
) => {
  const url = `${dictionaryReqUrl(Router.locale)}/${id}`;
  const res = await redirectIfUnauthorized(() =>
    _axios.put<WordType>(url, {
      word,
      description,
    })
  );
  return res?.data;
};

export const deleteDictionary = async (id: number) => {
  const url = `${dictionaryReqUrl(Router.locale)}/${id}`;
  const res = await redirectIfUnauthorized(() => _axios.delete(url));
  return res?.data;
};
