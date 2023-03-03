import axios, { HttpStatusCode } from 'axios';

import { issueTokens } from './request';

const _axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

_axios.interceptors.request.use(
  async (config) => {
    const accessToken = window.localStorage.getItem('accessToken');
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === HttpStatusCode.Unauthorized &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const storedRefreshToken = window.localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        return Promise.reject(error);
      }
      const res = await issueTokens(storedRefreshToken);
      const { accessToken, refreshToken } = res.data;
      if (accessToken && refreshToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        window.localStorage.setItem('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
      }
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default _axios;
