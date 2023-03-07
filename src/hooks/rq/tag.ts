import { useQuery } from '@tanstack/react-query';

import { TAG_KEY } from '@/lib/constant';
import { getPostTags } from '@/lib/request/tag';

const getQueryKey = (locale?: string, slug?: string) =>
  slug ? [TAG_KEY, locale, slug] : [TAG_KEY, locale];
export const usePostTagQuery = (locale: string | undefined, slug: string) => {
  const queryKey = getQueryKey(locale, slug);
  return useQuery<string[]>(queryKey, async () => {
    return await getPostTags(locale, slug);
  });
};
