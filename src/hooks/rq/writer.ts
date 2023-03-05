import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { WRITER_KEY } from '@/lib/constant';
import {
  addWriter,
  deleteWriter,
  getWriters,
  updateWriter,
} from '@/lib/request/writer';
import { WriterBaseType, WriterType } from '@/lib/types';

const queryKey = [WRITER_KEY];

export const useWriterAddMutate = () => {
  const queryClient = useQueryClient();

  return useMutation((writer: WriterBaseType) => addWriter(writer), {
    onMutate: async (writer: WriterBaseType) => {
      await queryClient.cancelQueries(queryKey);
      const previousWriters = queryClient.getQueryData<WriterType[]>(queryKey);
      queryClient.setQueryData<WriterBaseType[]>(queryKey, (old) => [
        ...(old ?? []),
        writer,
      ]);
      return { previousWriters };
    },
    onError: (err, writer, context) => {
      queryClient.setQueryData<WriterType[]>(
        queryKey,
        context?.previousWriters ?? []
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export const useWriterUpdateMutate = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (writer: WriterBaseType) => {
      if (!writer.id) {
        throw new Error('id is undefined');
      }
      return updateWriter(writer, writer.id);
    },
    {
      onMutate: async (writer: WriterBaseType) => {
        if (!writer.id || !(writer.image || writer.file)) {
          throw new Error('useWriterUpdateMutate.onMutate) error');
        }
        await queryClient.cancelQueries(queryKey);
        const previousWriters =
          queryClient.getQueryData<WriterType[]>(queryKey);
        queryClient.setQueryData<WriterType[]>(queryKey, (old) => {
          if (!old) {
            return [];
          }
          const newWriters = [...old];
          const idx = newWriters.findIndex((w) => w.id === writer.id);
          if (idx !== -1) {
            newWriters[idx] = { ...writer, id: writer.id as number };
          }
          return newWriters;
        });
        return { previousWriters };
      },
      onError: (err, writer, context) => {
        queryClient.setQueryData<WriterType[]>(
          queryKey,
          context?.previousWriters ?? []
        );
      },
    }
  );
};

export const useWriterDeleteMutate = () => {
  const queryClient = useQueryClient();

  return useMutation((id: number) => deleteWriter(id), {
    onMutate: async (id: number) => {
      await queryClient.cancelQueries(queryKey);
      const previousWriters = queryClient.getQueryData<WriterType[]>(queryKey);
      queryClient.setQueryData<WriterType[]>(queryKey, (old) => {
        if (!old) {
          return [];
        }
        return old.filter((w) => w.id !== id);
      });
      return { previousWriters };
    },
    onError: (err, writer, context) => {
      queryClient.setQueryData<WriterType[]>(
        queryKey,
        context?.previousWriters ?? []
      );
    },
  });
};

export const useWriterQuery = () =>
  useQuery<WriterType[]>(queryKey, async () => {
    return await getWriters();
  });
