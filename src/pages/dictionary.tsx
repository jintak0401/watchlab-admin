import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TextInput } from 'flowbite-react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { DICTIONARY_KEY } from '@/lib/constant';
import { getDictionaries } from '@/lib/request/dictionary';
import { WordType } from '@/lib/types';
import { filterWords } from '@/lib/utils';
import {
  useDicAddMutate,
  useDicDeleteMutate,
  useDicQuery,
  useDicUpdateMutate,
} from '@/hooks/rq/dictionary';

import InputWord from '@/components/dictionary/InputWord';
import WordTable from '@/components/dictionary/WordTable';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  const { locale } = context;
  await queryClient.prefetchQuery([DICTIONARY_KEY, locale], () =>
    getDictionaries(locale)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const DictionaryPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [wordList, setWordList] = useState<WordType[]>([]);
  const router = useRouter();
  const { data: totalWordList, isLoading } = useDicQuery(router.locale);
  const { mutateAsync: addDictionary } = useDicAddMutate(router.locale);
  const { mutateAsync: updateDictionary } = useDicUpdateMutate(router.locale);
  const { mutateAsync: deleteDictionary } = useDicDeleteMutate(router.locale);

  useEffect(() => {
    const filtered = filterWords<WordType>(
      totalWordList ?? [],
      'word',
      searchInput
    );
    setWordList(filtered);
  }, [searchInput, totalWordList]);

  const addWord = async (newWord: WordType) => {
    if (!totalWordList) return;

    if (totalWordList.some(({ word }) => word === newWord.word)) {
      alert(`There is already a word, ${newWord.word}`);
      return;
    }
    try {
      await addDictionary(newWord);
      toast.success(`Successfully added word, ${newWord.word}`);
    } catch (e) {
      alert('Failed to add word');
      throw e;
    }
  };

  const updateWord = async (word: WordType) => {
    try {
      if (!word.word || !word.description) {
        alert('Word and description are required');
        return;
      }
      await updateDictionary({ ...word });
      toast.success(`Successfully updated word, ${word.word}`);
    } catch (e) {
      alert('Failed to update word');
      throw e;
    }
  };

  const deleteWord = async (id: number) => {
    try {
      const word = await deleteDictionary(id);
      toast.success(`Successfully deleted word, ${word.word}`);
    } catch (e) {
      alert('Failed to delete word');
      throw e;
    }
  };

  return (
    <div className="mx-auto flex flex-col justify-center gap-4 xl:w-11/12">
      <InputWord addWord={addWord} />
      <hr className="mb-4 mt-6 border-gray-400" />
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
      ) : wordList?.length > 0 ? (
        <WordTable
          words={wordList}
          updateWord={updateWord}
          deleteWord={deleteWord}
        />
      ) : (
        <div className="my-10 text-center text-4xl text-gray-500">
          There is no word
        </div>
      )}
    </div>
  );
};

export default DictionaryPage;
