import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { POST_KEY } from '@/lib/constant';
import { getPostList } from '@/lib/request/post';
import { usePostListQuery } from '@/hooks/rq/post';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { locale } = context;
  await queryClient.prefetchQuery([POST_KEY, locale], () =>
    getPostList(locale)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const PostListPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const { data: totalPostList } = usePostListQuery(router.locale);
  return (
    <div>
      {totalPostList?.map((post) => (
        <span key={post.slug}>{post.slug}</span>
      ))}
    </div>
  );
};

export default PostListPage;
