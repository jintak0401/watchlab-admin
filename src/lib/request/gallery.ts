import Router from 'next/router';

import _axios from '@/lib/axiosInstance';
import { GalleryCardType, GalleryType } from '@/lib/types';
import { genMultiPartFormData } from '@/lib/utils';

import { redirectIfUnauthorized } from './index';

const galleryReqUrl = (locale?: string) => {
  return `/${locale}/gallery`;
};

export const getGalleries = async (locale = Router.locale) => {
  const url = galleryReqUrl(locale);
  const res = await redirectIfUnauthorized(() =>
    _axios.get<GalleryCardType[]>(url)
  );
  return res?.data;
};

export const addGallery = async (
  galleryCard: GalleryType,
  locale = Router.locale
) => {
  const url = galleryReqUrl(locale);
  const res = await redirectIfUnauthorized(() =>
    _axios.post<GalleryType>(url, genMultiPartFormData(galleryCard))
  );
  return res?.data;
};

export const updateGallery = async (
  galleryCard: GalleryType,
  id: number,
  locale = Router.locale
) => {
  const url = `${galleryReqUrl(locale)}/${id}`;
  const res = await redirectIfUnauthorized(() =>
    _axios.put<GalleryType>(url, genMultiPartFormData(galleryCard))
  );
  return res?.data;
};

export const deleteGallery = async (id: number, locale = Router.locale) => {
  const url = `${galleryReqUrl(locale)}/${id}`;
  const res = await redirectIfUnauthorized(() => _axios.delete(url));
  return res?.data;
};
