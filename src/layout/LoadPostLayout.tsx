import { AxiosError } from 'axios';
import { useRouter } from 'next/router';

import { isNotFound } from '@/lib/request';
import { PostType } from '@/lib/types';
import { usePostQuery } from '@/hooks/rq/post';
import { usePostTagQuery } from '@/hooks/rq/tag';

interface Props {
  Component: (props: { post: PostType; tags: string[] }) => JSX.Element;
}

const LoadPostLayout = ({ Component }: Props) => {
  const router = useRouter();
  const {
    data: post,
    isLoading: postLoading,
    isError: postIsError,
    error: postError,
  } = usePostQuery(router.locale, router.query.slug as string);
  const {
    data: tags,
    isLoading: tagsLoading,
    isError: tagsIsError,
    error: tagsError,
  } = usePostTagQuery(router.locale, router.query.slug as string);

  if (postIsError || tagsIsError) {
    if (isNotFound(postError as AxiosError, tagsError as AxiosError)) {
      return (
        <h2 className="text-3xl">
          Error... There is no post, {router.query.slug}
        </h2>
      );
    }
    return <h2 className="text-3xl">Error... Reload the page </h2>;
  }
  if (postLoading || tagsLoading) {
    return <h2 className="text-3xl">Loading...</h2>;
  }

  return <Component post={post} tags={tags} />;
};

export default LoadPostLayout;
