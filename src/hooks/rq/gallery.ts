import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GALLERY_KEY } from '@/lib/constant';
import {
  addGallery,
  deleteGallery,
  getGalleries,
  updateGallery,
} from '@/lib/request/gallery';
import { GalleryCardType, GalleryType } from '@/lib/types';

const getQueryKey = (locale?: string) => [GALLERY_KEY, locale];

export const useGallAddMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getQueryKey(locale);

  return useMutation(
    (galleryCard: GalleryType) => addGallery(galleryCard, locale),
    {
      onMutate: async (galleryCard: GalleryType) => {
        await queryClient.cancelQueries(useQueryKey);
        const previousGalleries =
          queryClient.getQueryData<GalleryType[]>(useQueryKey);
        queryClient.setQueryData<GalleryType[]>(useQueryKey, (old) => [
          ...(old ?? []),
          galleryCard,
        ]);
        return { previousGalleries };
      },
      onError: (err, galleryCard, context) => {
        queryClient.setQueryData<GalleryType[]>(
          useQueryKey,
          context?.previousGalleries ?? []
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(useQueryKey);
      },
    }
  );
};

export const useGallUpdateMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getQueryKey(locale);

  return useMutation(
    (galleryCard: GalleryType) => {
      if (!('id' in galleryCard)) {
        throw new Error('id is undefined');
      }
      return updateGallery(galleryCard, galleryCard.id as number, locale);
    },
    {
      onMutate: async (galleryCard: GalleryType) => {
        if (
          !('id' in galleryCard) ||
          !(galleryCard.image || galleryCard.file)
        ) {
          throw new Error('useGallUpdateMutate.onMutate) error');
        }
        await queryClient.cancelQueries(useQueryKey);
        const previousGalleries =
          queryClient.getQueryData<GalleryType[]>(useQueryKey);
        queryClient.setQueryData<GalleryType[]>(useQueryKey, (old) => {
          if (!old) {
            return [];
          }
          const newGalleries = [...old];
          const idx = newGalleries.findIndex(
            (w) => 'id' in w && w.id === galleryCard.id
          );
          if (idx !== -1) {
            newGalleries[idx] = { ...galleryCard };
          }
          return newGalleries;
        });
        return { previousGalleries };
      },
      onError: (err, galleryCard, context) => {
        queryClient.setQueryData<GalleryType[]>(
          useQueryKey,
          context?.previousGalleries ?? []
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(useQueryKey);
      },
    }
  );
};

export const useGallDeleteMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getQueryKey(locale);

  return useMutation((id: number) => deleteGallery(id, locale), {
    onMutate: async (id: number) => {
      await queryClient.cancelQueries(useQueryKey);
      const previousGalleries =
        queryClient.getQueryData<GalleryCardType[]>(useQueryKey);
      queryClient.setQueryData<GalleryCardType[]>(useQueryKey, (old) => {
        if (!old) {
          return [];
        }
        return old.filter((w) => w.id !== id);
      });
      return { previousGalleries };
    },
    onError: (err, newGalleryCard, context) => {
      queryClient.setQueryData<GalleryCardType[]>(
        useQueryKey,
        context?.previousGalleries ?? []
      );
    },
  });
};

export const useGallQuery = (locale?: string) =>
  useQuery<GalleryCardType[]>(getQueryKey(locale), async () => {
    return await getGalleries(locale);
  });
