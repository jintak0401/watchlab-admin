import clsx from 'clsx';
import { Spinner } from 'flowbite-react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import { GalleryType } from '@/lib/types';
import { useGallQuery } from '@/hooks/rq/gallery';

interface Props {
  closeModal: () => void;
  uploadGallery: (gallery: GalleryType) => void;
}
const GalleryModal = ({ closeModal, uploadGallery }: Props) => {
  const [selectedGallery, setSelectedGallery] =
    React.useState<GalleryType | null>(null);
  const router = useRouter();
  const {
    data: totalGalleryList,
    isLoading,
    isError,
  } = useGallQuery(router.locale);

  const onSelect = (gallery: GalleryType) => {
    if (!gallery) throw new Error('Gallery is not selected');
    uploadGallery(gallery as GalleryType);
    closeModal();
  };

  return (
    <div className="flex max-w-screen-2xl flex-col gap-x-4 gap-y-4 rounded-md bg-white p-4">
      <h2 className="text-3xl font-bold">Gallery Card</h2>
      <div className="grid max-h-[70vh] grid-cols-5 gap-4 overflow-y-auto">
        {isError && <h3>Error...</h3>}
        {isLoading && <Spinner className="self-center" />}
        {totalGalleryList?.map((gallery) => (
          <button
            key={gallery.id}
            className={clsx(
              'flex flex-col gap-y-2 rounded-md p-2 text-center hover:bg-gray-200',
              gallery.id === selectedGallery?.id && 'bg-primary-200'
            )}
            onClick={() =>
              setSelectedGallery((prev) =>
                prev?.id === gallery.id ? null : gallery
              )
            }
            onDoubleClick={() => onSelect(gallery)}
          >
            {gallery.image ? (
              <div className="flex flex-1 items-center justify-center">
                <NextImage
                  src={gallery.image}
                  alt={'gallery card'}
                  width={200}
                  height={200}
                  unoptimized
                />
              </div>
            ) : (
              <div className="animate-pulse bg-gray-200" />
            )}
            {gallery.title}
          </button>
        ))}
      </div>
      <div className="flex flex-row-reverse gap-4">
        <button
          className="h-10 w-20 rounded-md bg-gray-200 hover:bg-gray-400"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className={clsx(
            'w-20 rounded-md bg-primary-200',
            selectedGallery ? 'hover:bg-primary-400' : 'opacity-50'
          )}
          onClick={() => onSelect(selectedGallery as GalleryType)}
          disabled={!selectedGallery}
        >
          Append
        </button>
      </div>
    </div>
  );
};

export default GalleryModal;
