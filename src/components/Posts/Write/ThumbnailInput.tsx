import clsx from 'clsx';
import { FileInput } from 'flowbite-react';
import NextImage from 'next/image';
import { ChangeEvent } from 'react';

import { VALID_IMAGE_TYPES } from '@/lib/constant';

interface Props {
  thumbnail: string | File | null;
  setThumbnail: (thumbnail: string | File | null) => void;
  className?: string;
}
const ThumbnailInput = ({ thumbnail, setThumbnail, className = '' }: Props) => {
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !VALID_IMAGE_TYPES.includes(file.type)) return;
    setThumbnail(file);
  };

  return (
    <>
      <div className={clsx('h-full w-full', className)}>
        <FileInput onChange={handleFile} accept="image/*" />
        {thumbnail && (
          <div className="flex items-center justify-center">
            <NextImage
              className="max-w-[1000px] object-cover"
              src={
                typeof thumbnail === 'string'
                  ? thumbnail
                  : URL.createObjectURL(thumbnail)
              }
              alt="thumbnail"
              width="1910"
              height="1000"
              unoptimized
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ThumbnailInput;
