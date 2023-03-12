import { Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { WRITER_TYPE } from '@/lib/constant';
import { WriterType } from '@/lib/types';
import { filterWords } from '@/lib/utils';
import { useWriterQuery } from '@/hooks/rq/writer';

import Avatar from '@/components/Avatar';

interface Props {
  open: boolean;
  onSelect: (writer: WriterType) => void;
  onClose: () => void;
}
const SelectWriterModal = ({ open, onSelect, onClose }: Props) => {
  const { data: totalWriterList } = useWriterQuery();
  const [searchInput, setSearchInput] = useState('');
  const [mainWriter, setMainWriter] = useState<WriterType[]>([]);
  const [subWriter, setSubWriter] = useState<WriterType[]>([]);

  useEffect(() => {
    const filtered = filterWords<WriterType>(
      totalWriterList ?? [],
      'name',
      searchInput
    );
    const { main, sub } = filtered.reduce(
      (acc, cur) => {
        acc[cur.type as (typeof WRITER_TYPE)[number]].push(cur);
        return acc;
      },
      { main: [], sub: [] } as { main: WriterType[]; sub: WriterType[] }
    );
    setMainWriter(main);
    setSubWriter(sub);
  }, [searchInput, totalWriterList]);
  return (
    <Modal show={open} size="3xl" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body className="space-y-4">
        <h3 className="text-3xl font-medium text-gray-900">Select Writer</h3>
        <TextInput
          id="search_word"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          icon={FaSearch}
          placeholder="Search"
          required
        />
        <div className="space-y-4">
          {[
            { listName: 'main writer', list: mainWriter },
            { listName: 'sub writer', list: subWriter },
          ].map(({ listName, list }) => (
            <section key={listName}>
              <h2 className="text-xl">{listName.toUpperCase()}</h2>
              {list?.length > 0 ? (
                <div className="my-6 flex flex-wrap gap-4">
                  {mainWriter.map((writer) => (
                    <Button
                      color="gray"
                      onClick={() => onSelect(writer)}
                      key={writer.name}
                      className="flex"
                    >
                      <Avatar image={writer.image} width={50} height={50} />
                      <div className="ml-4 text-lg">{writer.name}</div>
                    </Button>
                  ))}
                </div>
              ) : (
                <h3 className="my-4 text-xl">There is no {listName}</h3>
              )}
            </section>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SelectWriterModal;
