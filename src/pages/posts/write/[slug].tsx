import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { POST_KEY, TAG_KEY } from '@/lib/constant';
import { getPost } from '@/lib/request/post';
import { getPostTags } from '@/lib/request/tag';
import { usePostQuery } from '@/hooks/rq/post';
import { usePostTagQuery } from '@/hooks/rq/tag';

import PostsWritePage from '@/pages/posts/write';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const {
    locale,
    query: { slug },
  } = context;

  await Promise.all([
    queryClient.prefetchQuery([POST_KEY, locale, slug], () =>
      getPost(locale, slug as string)
    ),
    queryClient.prefetchQuery([TAG_KEY, locale, slug]),
    () => getPostTags(locale, slug as string),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const PostEditPage = () => {
  const router = useRouter();
  const {
    data: post,
    isLoading: postLoading,
    isError: postError,
  } = usePostQuery(router.locale, router.query.slug as string);
  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsError,
  } = usePostTagQuery(router.locale, router.query.slug as string);

  if (postError || tagsError) {
    return <h2 className="text-3xl">Error... Reload the page </h2>;
  }
  if (postLoading || tagsLoading) {
    return <h2 className="text-3xl">Loading...</h2>;
  }

  return <PostsWritePage postProps={{ ...post, tags }} />;
};

export default PostEditPage;
