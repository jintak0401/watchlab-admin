import { Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

import { WordType } from '@/lib/types';

interface Props {
  addWord: (word: WordType) => Promise<void>;
}

const InputWord = ({ addWord }: Props) => {
  const [newWord, setNewWord] = useState<WordType>({
    word: '',
    description: '',
  });
  return (
    <form className="flex w-full items-end gap-4">
      <div>
        <Label className="pl-2" htmlFor="word" value="Word" />
        <TextInput
          type="text"
          id="word"
          onChange={(e) => {
            setNewWord({ ...newWord, word: e.target.value });
          }}
          value={newWord.word}
          required
        />
      </div>
      <div className="flex-1">
        <Label className="pl-2" htmlFor="description" value="Description" />
        <TextInput
          type="text"
          id="description"
          onChange={(e) => {
            setNewWord({ ...newWord, description: e.target.value });
          }}
          value={newWord.description}
          required
        />
      </div>
      <button
        type="submit"
        className="btn-primary btn"
        onClick={(e) => {
          e.preventDefault();
          addWord(newWord).then(() => {
            setNewWord({ word: '', description: '' });
          });
        }}
        disabled={!newWord.word || !newWord.description}
      >
        Add
      </button>
    </form>
  );
};

export default InputWord;
