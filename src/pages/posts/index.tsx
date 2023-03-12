import { dehydrate, QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { POST_KEY, POST_TAG_KEY } from '@/lib/constant';
import { isNotFound } from '@/lib/request';
import { getPostList } from '@/lib/request/post';
import { getAllPostTags } from '@/lib/request/tag';
import { PostItemType } from '@/lib/types';
import { usePostDeleteMutate, usePostListQuery } from '@/hooks/rq/post';
import { useAllPostTagQuery } from '@/hooks/rq/tag';

import ModalDelete from '@/components/Posts/List/ModalDelete';
import PostList from '@/components/Posts/List/PostList';
import WritePostButton from '@/components/Posts/List/WritePostButton';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { locale } = context;
  await queryClient.prefetchQuery([POST_KEY, locale], () =>
    getPostList(locale)
  );

  await Promise.all([
    queryClient.prefetchQuery([POST_KEY, locale], () => getPostList(locale)),
    queryClient.prefetchQuery([POST_TAG_KEY, locale], () =>
      getAllPostTags(locale)
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const PostListPage = () => {
  const router = useRouter();
  const {
    data: totalPostList,
    isLoading: postLoading,
    error: postError,
  } = usePostListQuery(router.locale);
  const {
    data: totalTagList,
    isLoading: tagLoading,
    error: tagError,
  } = useAllPostTagQuery(router.locale);
  const { mutateAsync: deletePost } = usePostDeleteMutate(router.locale);
  const [targetPost, setTargetPost] = useState<PostItemType | null>(null);

  const getPostProps = (
    posts: PostItemType[],
    tags: { [slug: string]: string[] }
  ) => {
    return posts.map((post) => {
      return { ...post, tags: tags[post.slug] ?? [] };
    });
  };

  const onDelete = async (post: PostItemType) => {
    setTargetPost(post);
  };

  const onDeleteConfirm = async () => {
    if (!targetPost?.slug) throw new Error('There is no selected post');
    try {
      await deletePost(targetPost.slug);
      toast.success('Post deleted successfully');
    } catch (e) {
      toast.error('Error... Post delete failed');
    } finally {
      setTargetPost(null);
    }
  };

  if (isNotFound(postError as AxiosError, tagError as AxiosError)) {
    return <h2 className="text-3xl">Error... There is no post</h2>;
  } else if (postLoading || tagLoading) {
    return <h2 className="text-3xl">Loading...</h2>;
  } else if (totalPostList?.length === 0) {
    return <h2 className="text-3xl">There is no post</h2>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <WritePostButton />
      <PostList
        posts={getPostProps(totalPostList ?? [], totalTagList ?? {})}
        onDelete={onDelete}
      />
      <ModalDelete
        opened={!!targetPost}
        onClose={() => setTargetPost(null)}
        onConfirm={onDeleteConfirm}
      />
    </div>
  );
};

export default PostListPage;
