import { PostItemType } from '@/lib/types';

import PostItem from '@/components/Posts/List/PostItem';

interface Props {
  posts: PostItemType[];
  onDelete: (post: PostItemType) => Promise<void>;
}

const PostList = ({ posts, onDelete }: Props) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.slug} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PostList;
