import clsx from 'clsx';
import NextImage from 'next/image';
import { FaEdit } from 'react-icons/fa';

import type { GalleryCardType } from '@/lib/types';

interface Props {
  galleryCard: GalleryCardType;
  className?: string;
  onEditStart: (id: number) => void;
}
const GalleryCard = ({ galleryCard, className, onEditStart }: Props) => {
  return (
    <article className={clsx('group bg-white pb-4 shadow-md', className)}>
      <NextImage
        className="aspect-square w-full object-cover"
        src={galleryCard.image}
        alt={galleryCard.title}
        width={300}
        height={300}
      />
      <h2 className="relative my-4 block w-full text-center text-xl font-bold">
        {galleryCard.title}
        <button
          onClick={() => onEditStart(galleryCard.id)}
          className="btn-ghost btn-square btn-sm btn absolute top-0 right-2 hidden self-center group-hover:inline-block"
        >
          <FaEdit className="mx-auto h-5 w-5 fill-current text-primary-700" />
        </button>
      </h2>
      <p className="px-2">{galleryCard.desc}</p>
    </article>
  );
};

export default GalleryCard;
