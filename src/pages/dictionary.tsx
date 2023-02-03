import { TextInput } from 'flowbite-react';
import { FormEvent, useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { WordType } from '@/lib/types';
import { filterWords } from '@/lib/utils';

import InputWord from '@/components/dictionary/InputWord';
import WordTable from '@/components/dictionary/WordTable';

const DUMMY: WordType[] = [
  {
    word: 'clock',
    desc: 'A thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows time',
  },
  {
    word: 'clock1',
    desc: 'A thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows time',
  },
  {
    word: 'clock2',
    desc: 'A thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows time',
  },
  {
    word: 'clock3',
    desc: 'A thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows time',
  },
  {
    word: 'clock4',
    desc: 'A thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows time',
  },
  {
    word: 'clock5',
    desc: 'A thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows timeA thing which shows time',
  },
  {
    word: 'time',
    desc: 'time',
  },
  {
    word: 'hour hand',
    desc: 'a hand of a clock which shows hour',
  },
  {
    word: 'minute hand',
    desc: 'a hand of a clock which shows minute',
  },
  {
    word: 'second hand',
    desc: 'a hand of a clock which shows second',
  },
];

const DictionaryPage = () => {
  const [inputWord, setInputWord] = useState('');
  const [inputDesc, setInputDesc] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [wordList, setWordList] = useState<WordType[]>(DUMMY);

  useEffect(() => {
    const filtered = filterWords(DUMMY, searchInput);
    setWordList(filtered);
  }, [searchInput]);

  const addWord = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (DUMMY.filter(({ word }) => word === inputWord).length > 0) {
      alert('이미 존재하는 단어입니다.');
      return;
    }

    DUMMY.unshift({ word: inputWord, desc: inputDesc });
    setInputWord('');
    setInputDesc('');

    const filtered = filterWords(DUMMY, searchInput);
    setWordList(filtered);
  };
  return (
    <div className="mx-auto flex flex-col justify-center gap-4 xl:w-11/12">
      <InputWord
        word={inputWord}
        setWord={setInputWord}
        desc={inputDesc}
        setDesc={setInputDesc}
        addWord={addWord}
      />
      <hr className="mb-4 mt-6 border-gray-400" />
      <div>
        <TextInput
          id="search_word"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          icon={FaSearch}
          placeholder="Search"
          required
        />
      </div>
      <WordTable words={wordList} />
    </div>
  );
};

export default DictionaryPage;
