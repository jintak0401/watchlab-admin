import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineEye } from 'react-icons/ai';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import { PostItemType } from '@/lib/types';

interface Props {
  post: PostItemType;
  onDelete: (post: PostItemType) => Promise<void>;
}
const PostItem = ({ post, onDelete }: Props) => {
  const { title, thumbnail, slug, writer, tags, view, createdAt } = post;
  const router = useRouter();
  return (
    <div className="group flex gap-4 rounded-md bg-gray-100 p-4 hover:bg-gray-200">
      <NextImage
        className="aspect-[191/100] w-[200px] rounded-md object-cover"
        src={thumbnail}
        alt={'thumbnail'}
        width={1000}
        height={500}
        unoptimized
      />
      <div className="flex flex-1 flex-col">
        <Link className="w-fit" href={`/posts/view/${slug}`}>
          <h2 className="text-2xl font-semibold hover:text-primary-700">
            {title}
          </h2>
        </Link>
        <div className="flex gap-3">
          {tags?.map((tag) => (
            <span key={`${slug}_${tag}`} className="text-primary-500">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex w-fit items-center justify-center gap-3">
          <span className="flex items-center justify-center gap-2">
            <NextImage
              className="rounded-full"
              src={writer.image}
              alt={'writer'}
              width={30}
              height={30}
              unoptimized
            />
            {writer.name}
          </span>
          <span>/</span>
          <span className="flex items-center justify-center gap-1">
            <AiOutlineEye />
            {view}
          </span>
          <span>/</span>
          {createdAt && <span>{new Date(createdAt).toDateString()}</span>}
        </div>
      </div>
      <button
        className="invisible flex items-center justify-center gap-1 hover:text-primary-500 group-hover:visible"
        onClick={() => router.push(`/posts/write/${slug}`)}
      >
        <FaEdit />
      </button>
      <button
        className="invisible flex items-center justify-center gap-1 hover:text-red-500 group-hover:visible"
        onClick={() => onDelete(post)}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default PostItem;
