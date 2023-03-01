import axios, { AxiosPromise, HttpStatusCode } from 'axios';
import Router from 'next/router';

import { LOGIN_PAGE_URL } from '@/lib/constant';

export const redirectIfUnauthorized = async (request: () => AxiosPromise) => {
  try {
    return await request();
  } catch (e) {
    if (
      axios.isAxiosError(e) &&
      e.response?.status === HttpStatusCode.Unauthorized
    ) {
      Router.replace(LOGIN_PAGE_URL).then(() => {
        alert('Login disabled. Please login again.');
      });
    } else {
      console.error('Unexpected Error: ', e);
      alert('Unexpected Error: ' + e);
    }
  }
};

export const refreshTokens = async (refreshToken: string | null) => {
  return axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};
