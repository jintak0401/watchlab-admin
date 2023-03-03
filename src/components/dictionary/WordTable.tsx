import { Table } from 'flowbite-react';
import { useState } from 'react';
import { FaCheck, FaEdit, FaTimes, FaTrashAlt } from 'react-icons/fa';

import type { WordType } from '@/lib/types';

interface Props {
  words: WordType[];
  className?: string;
  updateWord: (word: WordType) => Promise<void>;
  deleteWord: (id: number) => Promise<void>;
}

const NormalTableRow = ({
  word: _word,
  onDelete,
  onEdit,
}: {
  word: WordType;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const { word, description } = _word;
  return (
    <Table.Row className="group bg-white">
      <Table.Cell className="py-4">{word}</Table.Cell>
      <Table.Cell className="py-4">{description}</Table.Cell>
      <Table.Cell className="flex h-full items-center justify-center gap-2 py-4">
        <button
          className="invisible rounded-md p-1 hover:bg-gray-200 group-hover:visible"
          onClick={() => {
            onEdit();
          }}
        >
          <FaEdit className="h-5 w-5" />
        </button>
        <button
          className="invisible rounded-md p-1 hover:bg-gray-200 group-hover:visible"
          onClick={() => {
            onDelete();
          }}
        >
          <FaTrashAlt className="h-5 w-5" />
        </button>
      </Table.Cell>
    </Table.Row>
  );
};

const EditTableRow = ({
  word: _word,
  onEdit,
  onUpdate,
  onCancel,
}: {
  word: WordType;
  onEdit: (word: WordType) => void;
  onUpdate: () => void;
  onCancel: () => void;
}) => {
  const { word, description } = _word;
  return (
    <Table.Row className="bg-white">
      <Table.Cell className="py-4">
        <input
          type="text"
          value={word}
          onChange={(e) => {
            onEdit({ ..._word, word: e.target.value });
          }}
        />
      </Table.Cell>
      <Table.Cell className="py-4">
        <textarea
          className="w-full"
          value={description}
          onChange={(e) => {
            onEdit({ ..._word, description: e.target.value });
          }}
        />
      </Table.Cell>
      <Table.Cell className="flex h-full items-center justify-center gap-2 py-4">
        <button
          className="rounded-md p-1 hover:bg-gray-200"
          onClick={() => {
            onUpdate();
          }}
        >
          <FaCheck className="h-5 w-5" />
        </button>
        <button
          className="rounded-md p-1 hover:bg-gray-200"
          onClick={() => {
            onCancel();
          }}
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </Table.Cell>
    </Table.Row>
  );
};

const WordTable = ({ words, className, deleteWord, updateWord }: Props) => {
  const [editWord, setEditWord] = useState<WordType>({
    word: '',
    description: '',
  });
  return (
    <Table className={className ?? ''}>
      <Table.Head className="bg-gray-200">
        <Table.HeadCell className="w-52">Word</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell className="w-24" />
      </Table.Head>
      <Table.Body className="divide-y">
        {words.map((word) =>
          word.id !== undefined && word.id === editWord.id ? (
            <EditTableRow
              key={word.word}
              word={editWord}
              onEdit={(_word: WordType) => {
                setEditWord(_word);
              }}
              onUpdate={() => {
                updateWord(editWord).then(() => {
                  setEditWord({ word: '', description: '' });
                });
              }}
              onCancel={() => {
                setEditWord({ word: '', description: '' });
              }}
            />
          ) : (
            <NormalTableRow
              key={word.word}
              word={word}
              onEdit={() => {
                setEditWord({ ...word });
              }}
              onDelete={() => {
                deleteWord(word.id as number);
              }}
            />
          )
        )}
      </Table.Body>
    </Table>
  );
};

export default WordTable;
