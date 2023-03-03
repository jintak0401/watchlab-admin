import clsx from 'clsx';
import NextImage from 'next/image';
import { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import type { GalleryType } from '@/lib/types';

interface Props {
  galleryCard: GalleryType;
  className?: string;
  onEditStart: () => void;
  onDelete: () => void;
}
const GalleryCard = ({
  galleryCard,
  className,
  onEditStart,
  onDelete,
}: Props) => {
  const [loading, setLoading] = useState(true);
  return (
    <article
      className={clsx('group relative bg-white pb-4 shadow-md', className)}
    >
      <div
        className={clsx(
          'absolute top-0 left-0 aspect-square w-full animate-pulse bg-gray-300',
          loading ? 'block' : 'hidden'
        )}
      />
      {galleryCard.image ? (
        <NextImage
          className="aspect-square w-full object-cover"
          src={galleryCard.image}
          alt={galleryCard.title}
          onLoadingComplete={() => setLoading(false)}
          width={300}
          height={300}
        />
      ) : (
        <div
          className={clsx('aspect-square w-full', loading ? 'block' : 'hidden')}
        />
      )}
      <div
        className={clsx(
          'invisible mt-2 flex w-full flex-row-reverse gap-2 px-2',
          loading ? 'invisible' : 'group-hover:visible'
        )}
      >
        <button
          onClick={onEditStart}
          className="btn-ghost btn-square btn-sm btn self-center"
          disabled={loading}
        >
          <FaEdit className="mx-auto h-5 w-5 fill-current text-primary-700" />
        </button>
        <button
          onClick={onDelete}
          className="btn-ghost btn-square btn-sm btn self-center"
          disabled={loading}
        >
          <FaTrashAlt className="mx-auto h-5 w-5 fill-current text-primary-700" />
        </button>
      </div>
      <h2 className="relative mb-2 block w-full text-center text-xl font-bold">
        {galleryCard.title}
      </h2>
      <p className="px-2">{galleryCard.description}</p>
    </article>
  );
};

export default GalleryCard;
