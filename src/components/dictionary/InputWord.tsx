import { Label, TextInput } from 'flowbite-react';
import { FormEvent } from 'react';

interface Props {
  word: string;
  setWord: (word: string) => void;
  desc: string;
  setDesc: (description: string) => void;
  addWord: (e: FormEvent<HTMLButtonElement>) => void;
}

const InputWord = ({ word, setWord, desc, setDesc, addWord }: Props) => {
  return (
    <form className="flex w-full items-end gap-4">
      <div>
        <Label className="pl-2" htmlFor="word" value="Word" />
        <TextInput
          type="text"
          id="word"
          onChange={(e) => setWord(e.target.value)}
          value={word}
          required
        />
      </div>
      <div className="flex-1">
        <Label className="pl-2" htmlFor="description" value="Description" />
        <TextInput
          type="text"
          id="description"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          required
        />
      </div>
      <button
        type="submit"
        className="btn-primary btn"
        onClick={addWord}
        disabled={!word || !desc}
      >
        Add
      </button>
    </form>
  );
};

export default InputWord;
