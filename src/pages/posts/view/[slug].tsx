import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

import { POST_KEY, TAG_KEY } from '@/lib/constant';
import { getPost } from '@/lib/request/post';
import { getPostTags } from '@/lib/request/tag';
import { PostType } from '@/lib/types';

import LoadPostLayout from '@/layout/LoadPostLayout';
import PostViewLayout from '@/layout/PostViewLayout';

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

const PostViewPage = () => {
  const Component = ({ post, tags }: { post: PostType; tags: string[] }) => {
    const props = {
      title: post.title,
      thumbnail: post.thumbnail,
      content: post.content,
      tags,
    };
    return (
      <>
        <PostViewLayout {...props} />
        <Link
          href={`/posts/write/${post.slug}`}
          className="fixed bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary-400 hover:bg-primary-500"
        >
          <FaEdit className="h-8 w-8 fill-current text-white" />
        </Link>
      </>
    );
  };
  return <LoadPostLayout Component={Component} />;
};

export default PostViewPage;
