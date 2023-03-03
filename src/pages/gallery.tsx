import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TextInput } from 'flowbite-react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { GALLERY_KEY } from '@/lib/constant';
import { getGalleries } from '@/lib/request/gallery';
import type { GalleryCardType, GalleryType } from '@/lib/types';
import { filterWords } from '@/lib/utils';
import {
  useGallAddMutate,
  useGallDeleteMutate,
  useGallQuery,
  useGallUpdateMutate,
} from '@/hooks/rq/gallery';

import GalleryCard from '@/components/gallery/GalleryCard';
import GalleryInputCard from '@/components/gallery/GalleryInputCard';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { locale } = context;
  await queryClient.prefetchQuery([GALLERY_KEY, locale], () =>
    getGalleries(locale)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const GalleryPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [editCardId, setEditCardId] = useState(-1);
  const [galleryList, setGalleryList] = useState<GalleryCardType[]>([]);
  const router = useRouter();
  const {
    data: totalGalleries,
    isLoading,
    isError,
  } = useGallQuery(router.locale);
  const { mutateAsync: addGallery } = useGallAddMutate(router.locale);
  const { mutateAsync: updateGallery } = useGallUpdateMutate(router.locale);
  const { mutateAsync: deleteGallery } = useGallDeleteMutate(router.locale);

  useEffect(() => {
    const filtered = filterWords<GalleryCardType>(
      totalGalleries ?? [],
      'title',
      searchInput
    );
    setGalleryList(filtered);
  }, [searchInput, totalGalleries]);

  const onCancel = () => {
    setEditCardId(-1);
  };

  const onCreate = async (card: GalleryType) => {
    if (totalGalleries?.some(({ title }) => title === card.title)) {
      alert(`There is already a title, ${card.title}`);
      throw new Error('There is already a title');
    }
    try {
      await addGallery(card);
      toast.success('success to add card');
    } catch (e) {
      console.error(e);
      toast.error('fail to add card');
      throw e;
    }
  };

  const onUpdate = async (card: GalleryType) => {
    try {
      await updateGallery(card);
      setEditCardId(-1);
      toast.success('success to update card');
    } catch (e) {
      console.error(e);
      toast.error('fail to update card');
      throw e;
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteGallery(id);
      toast.success('success to delete card');
    } catch (e) {
      console.error(e);
      toast.error('fail to delete card');
      throw e;
    }
  };

  if (isError) {
    return <div>Error... Please reload page</div>;
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-4 xl:w-11/12">
      <TextInput
        id="search_word"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        type="text"
        icon={FaSearch}
        placeholder="Search"
        required
      />
      {isLoading ? (
        <div className="my-10 text-center text-4xl text-gray-500">
          Loading...
        </div>
      ) : (
        <>
          {(totalGalleries.length === 0 && !searchInput) ||
          galleryList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {!searchInput && (
                <GalleryInputCard mode="create" onDone={onCreate} />
              )}
              {galleryList.map((galleryCard) =>
                editCardId !== galleryCard.id ? (
                  <GalleryCard
                    key={galleryCard.id ?? galleryCard.title}
                    onEditStart={() => setEditCardId(galleryCard.id)}
                    onDelete={() => onDelete(galleryCard.id)}
                    galleryCard={galleryCard as GalleryCardType}
                  />
                ) : (
                  <GalleryInputCard
                    key={galleryCard.id ?? galleryCard.title}
                    card={galleryCard}
                    mode="update"
                    onDone={onUpdate}
                    onCancel={onCancel}
                  />
                )
              )}
            </div>
          ) : (
            <div className="my-10 text-center text-4xl text-gray-500">
              There is no gallery card
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryPage;
