import axios from 'axios';

import _axios from '@/lib/axiosInstance';
import { PostEditType, PostItemType, PostType } from '@/lib/types';
import { genMultiPartFormData } from '@/lib/utils';

import { redirectIfUnauthorized } from './index';

const s3UploadReqUrl = '/s3';
const getPostReqUrl = (locale?: string, slug?: string) =>
  slug !== undefined ? `/${locale}/post/${slug}` : `/${locale}/post`;

export const uploadS3 = async (file: Blob, path: string) => {
  const res = await redirectIfUnauthorized(() =>
    _axios.post(s3UploadReqUrl, genMultiPartFormData({ file, path }))
  );
  return res?.data;
};

export const deleteS3 = async (path: string) => {
  const res = await redirectIfUnauthorized(() =>
    _axios.delete(`${s3UploadReqUrl}/${path}`)
  );
  return res?.data;
};

export const getPostList = async (locale?: string) => {
  const url = `${getPostReqUrl(locale)}?all=true`;
  const res = await _axios.get<PostItemType[]>(url);
  return res?.data;
};

export const getPost = async (locale: string | undefined, slug: string) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}${getPostReqUrl(
    locale,
    slug
  )}?admin=true`;
  const res = await axios.get<PostType>(url);
  return res?.data;
};

export const addPost = async (
  locale: undefined | string,
  post: PostEditType
) => {
  const res = await redirectIfUnauthorized(() =>
    _axios.post(getPostReqUrl(locale), genMultiPartFormData(post))
  );
  return res?.data;
};

export const updatePost = async (
  locale: undefined | string,
  slug: string | undefined,
  post: PostEditType
) => {
  const res = await redirectIfUnauthorized(() =>
    _axios.put(getPostReqUrl(locale, slug), genMultiPartFormData(post))
  );
  return res?.data;
};

export const getPostCount = async (locale?: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/${locale}/post/count`
  );
  return res?.data;
};

export const deletePost = async (locale: string | undefined, slug: string) => {
  const res = await redirectIfUnauthorized(() =>
    _axios.delete(getPostReqUrl(locale, slug))
  );
  return res?.data;
};
