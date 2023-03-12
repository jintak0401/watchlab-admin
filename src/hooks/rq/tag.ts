import { useQuery } from '@tanstack/react-query';

import { POST_TAG_KEY, TAG_KEY } from '@/lib/constant';
import { getAllPostTags, getAllTags, getPostTags } from '@/lib/request/tag';

const getTagQueryKey = (locale?: string, slug?: string) =>
  slug ? [TAG_KEY, locale, slug] : [TAG_KEY, locale];

const getPostTagQueryKey = (locale?: string) => [POST_TAG_KEY, locale];

export const useAllTagsQuery = (locale: string | undefined) => {
  const queryKey = getTagQueryKey(locale);
  return useQuery<string[]>(queryKey, async () => {
    return await getAllTags(locale);
  });
};

export const usePostTagQuery = (locale: string | undefined, slug: string) => {
  const queryKey = getTagQueryKey(locale, slug);
  return useQuery<string[]>(queryKey, async () => {
    return await getPostTags(locale, slug);
  });
};

export const useAllPostTagQuery = (locale: string | undefined) => {
  return useQuery<{ [slug: string]: string[] }>(
    getPostTagQueryKey(locale),
    async () => {
      return await getAllPostTags(locale);
    }
  );
};
