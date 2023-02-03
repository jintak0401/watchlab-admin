import { Table } from 'flowbite-react';

import type { WordType } from '@/lib/types';

interface Props {
  words: WordType[];
  className?: string;
}

const WordTable = ({ words, className }: Props) => {
  return (
    <Table className={className ?? ''}>
      <Table.Head className="bg-gray-200">
        <Table.HeadCell>Word</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {words.map(({ word, desc }) => (
          <Table.Row key={word} className="bg-white">
            <Table.Cell className="py-4">{word}</Table.Cell>
            <Table.Cell className="py-4">{desc}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default WordTable;
