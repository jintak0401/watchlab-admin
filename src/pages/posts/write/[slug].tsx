import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';

import { POST_KEY, TAG_KEY } from '@/lib/constant';
import { getPost } from '@/lib/request/post';
import { getPostTags } from '@/lib/request/tag';
import { PostType } from '@/lib/types';

import LoadPostLayout from '@/layout/LoadPostLayout';
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
  const Component = ({ post, tags }: { post: PostType; tags: string[] }) => {
    const props = { ...post, tags };
    return <PostsWritePage postProps={props} />;
  };

  return <LoadPostLayout Component={Component} />;
};

export default PostEditPage;
