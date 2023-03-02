import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addDictionary,
  deleteDictionary,
  getDictionaries,
  updateDictionary,
} from '@/lib/request';
import { WordType } from '@/lib/types';

const DIC_KEY = 'dictionary';

const getQueryKey = (locale?: string) => [DIC_KEY, locale];

export const useDicAddMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getQueryKey(locale);

  return useMutation((word: WordType) => addDictionary(word, locale), {
    onMutate: async (newWord: WordType) => {
      await queryClient.cancelQueries(useQueryKey);
      const previousWords = queryClient.getQueryData<WordType[]>(useQueryKey);
      queryClient.setQueryData<WordType[]>(useQueryKey, (old) => [
        ...(old ?? []),
        newWord,
      ]);
      return { previousWords };
    },
    onError: (err, newWord, context) => {
      queryClient.setQueryData<WordType[]>(
        useQueryKey,
        context?.previousWords ?? []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(useQueryKey);
    },
  });
};

export const useDicUpdateMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getQueryKey(locale);

  return useMutation(
    (word: WordType) => {
      if (word.id === undefined) {
        throw new Error('id is undefined');
      }
      return updateDictionary(word, word.id);
    },
    {
      onMutate: async (word: WordType) => {
        await queryClient.cancelQueries(useQueryKey);
        const previousWords = queryClient.getQueryData<WordType[]>(useQueryKey);
        queryClient.setQueryData<WordType[]>(useQueryKey, (old) => {
          if (!old) {
            return [];
          }
          const newWords = [...old];
          const idx = newWords.findIndex((w) => w.id === word.id);
          if (idx !== -1) {
            newWords[idx] = word;
          }
          return newWords;
        });
        return { previousWords };
      },
      onError: (err, newWord, context) => {
        queryClient.setQueryData<WordType[]>(
          useQueryKey,
          context?.previousWords ?? []
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(useQueryKey);
      },
    }
  );
};

export const useDicDeleteMutate = (locale?: string) => {
  const queryClient = useQueryClient();
  const useQueryKey = getQueryKey(locale);

  return useMutation((id: number) => deleteDictionary(id), {
    onMutate: async (id: number) => {
      await queryClient.cancelQueries(useQueryKey);
      const previousWords = queryClient.getQueryData<WordType[]>(useQueryKey);
      queryClient.setQueryData<WordType[]>(useQueryKey, (old) => {
        if (!old) {
          return [];
        }
        return old.filter((w) => w.id !== id);
      });
      return { previousWords };
    },
    onError: (err, newWord, context) => {
      queryClient.setQueryData<WordType[]>(
        useQueryKey,
        context?.previousWords ?? []
      );
    },
  });
};

export const useDicQuery = (locale?: string) =>
  useQuery<WordType[]>(getQueryKey(locale), async () => {
    return await getDictionaries(locale);
  });
