import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { POST_KEY, TAG_KEY } from '@/lib/constant';
import { addPost, getPost, getPostList, updatePost } from '@/lib/request/post';
import { PostEditType, PostItemType, PostType } from '@/lib/types';

const getPostQueryKey = (locale?: string, slug?: string) =>
  slug ? [POST_KEY, locale, slug] : [POST_KEY, locale];

const getTagQueryKey = (locale?: string, slug?: string) =>
  slug ? [TAG_KEY, locale, slug] : [TAG_KEY, locale];

export const usePostUpdateMutate = (
  locale: string | undefined,
  slug: string | undefined
) => {
  const queryClient = useQueryClient();
  const useQueryKey = getPostQueryKey(locale);

  return useMutation((post: PostEditType) => updatePost(locale, slug, post), {
    onMutate: async (post: PostEditType) => {
      if (post.content && post.content === '') {
        throw new Error('content is empty');
      } else if (!slug) {
        throw new Error('slug is undefined');
      }
      await queryClient.cancelQueries(useQueryKey);
      const { content, thumbnail, ...rest } = post;
      const previousPosts =
        queryClient.getQueryData<PostItemType[]>(useQueryKey);
      queryClient.setQueryData<PostItemType[]>(useQueryKey, (old) => {
        return (
          old?.map((post) => {
            if (post.slug === slug) {
              return {
                ...rest,
                thumbnail: typeof thumbnail === 'string' ? thumbnail : '',
                view: 0,
                writer: {
                  name: post.writer.name,
                  image: '',
                },
              };
            }
            return post;
          }) ?? []
        );
      });
      return { previousPosts };
    },
    onError: (err, post, context) => {
      queryClient.setQueryData<PostItemType[]>(
        useQueryKey,
        context?.previousPosts ?? []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(useQueryKey);
      queryClient.invalidateQueries(getTagQueryKey(locale, slug));
    },
  });
};

export const usePostAddMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getPostQueryKey(locale);

  return useMutation((post: PostEditType) => addPost(locale, post), {
    onMutate: async (post: PostEditType) => {
      if (post.content && post.content === '') {
        throw new Error('content is empty');
      }
      await queryClient.cancelQueries(useQueryKey);
      const { content, thumbnail, ...rest } = post;
      const previousPosts =
        queryClient.getQueryData<PostItemType[]>(useQueryKey);
      queryClient.setQueryData<PostItemType[]>(useQueryKey, (old) => [
        ...(old ?? []),
        {
          ...rest,
          view: 0,
          writer: {
            name: post.writer,
            image: '',
          },
          thumbnail: typeof thumbnail === 'string' ? thumbnail : '',
        },
      ]);
      return { previousPosts };
    },
    onError: (err, post, context) => {
      queryClient.setQueryData<PostItemType[]>(
        useQueryKey,
        context?.previousPosts ?? []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(useQueryKey);
    },
  });
};
export const usePostQuery = (locale: string | undefined, slug: string) => {
  const queryKey = getPostQueryKey(locale, slug);
  return useQuery<PostType>(queryKey, async () => {
    return await getPost(locale, slug);
  });
};

export const usePostListQuery = (locale?: string) =>
  useQuery<PostItemType[]>(getPostQueryKey(locale), async () => {
    return await getPostList(locale);
  });
