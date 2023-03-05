import _axios from '@/lib/axiosInstance';
import { WriterBaseType } from '@/lib/types';
import { genMultiPartFormData } from '@/lib/utils';

import { redirectIfUnauthorized } from './index';

const writerReqUrl = '/writer';

export const getWriters = async () => {
  const res = await redirectIfUnauthorized(() => _axios.get(writerReqUrl));
  return res?.data;
};

export const addWriter = async (writer: WriterBaseType) => {
  const res = await redirectIfUnauthorized(() =>
    _axios.post(writerReqUrl, genMultiPartFormData(writer))
  );
  return res?.data;
};

export const updateWriter = async (writer: WriterBaseType, id: number) => {
  const url = `${writerReqUrl}/${id}`;
  const { id: _, ...rest } = writer;
  const res = await redirectIfUnauthorized(() =>
    _axios.put(url, genMultiPartFormData(rest))
  );
  return res?.data;
};

export const deleteWriter = async (id: number) => {
  const url = `${writerReqUrl}/${id}`;
  const res = await redirectIfUnauthorized(() => _axios.delete(url));
  return res?.data;
};
