import { TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { WRITER_TYPE } from '@/lib/constant';
import { WriterBaseType, WriterType } from '@/lib/types';
import { filterWords } from '@/lib/utils';
import {
  useWriterAddMutate,
  useWriterDeleteMutate,
  useWriterQuery,
  useWriterUpdateMutate,
} from '@/hooks/rq/writer';
import useIsBrowser from '@/hooks/useIsBrowser';

import AddWriterButton from '@/components/writer/AddWriterButton';
import InputWriterModal from '@/components/writer/InputWriterModal';
import WriterCard from '@/components/writer/WriterCard';
import WriterDeleteModal from '@/components/writer/WriterDeleteModal';

const DELETE_WRITER = 'delete';
const UPDATE_WRITER = 'update';
const ADD_WRITER = 'add';

const WriterPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [mainWriter, setMainWriter] = useState<WriterType[]>([]);
  const [subWriter, setSubWriter] = useState<WriterType[]>([]);
  const [openedModal, setOpenedModal] = useState<
    '' | 'delete' | 'update' | 'add'
  >('');
  const [targetWriter, setTargetWriter] = useState<WriterType | null>(null);
  const isBrowser = useIsBrowser();
  const { data: totalWriterList, isLoading, isError } = useWriterQuery();
  const { mutateAsync: deleteWriter } = useWriterDeleteMutate();
  const { mutateAsync: updateWriter } = useWriterUpdateMutate();
  const { mutateAsync: addWriter } = useWriterAddMutate();

  const onDelete = async () => {
    if (!targetWriter) {
      throw new Error('No target writer');
    }
    try {
      await deleteWriter(targetWriter.id);
      toast.success('Writer deleted successfully');
    } catch (e) {
      console.error(e);
      toast.error('Writer delete fail');
      throw e;
    } finally {
      setOpenedModal('');
      setTargetWriter(null);
    }
  };

  const modalOpen = (
    type: 'delete' | 'update' | 'add',
    writer?: WriterType
  ) => {
    setTargetWriter(writer ?? null);
    setOpenedModal(type);
  };

  const modalClose = () => {
    setTargetWriter(null);
    setOpenedModal('');
  };

  const onDone = (type: 'add' | 'update') => async (writer: WriterBaseType) => {
    const func = type === 'add' ? addWriter : updateWriter;
    try {
      await func(writer);
      toast.success('save successfully');
    } catch (e) {
      toast.error('save fail');
      console.error(e);
    } finally {
      setTargetWriter(null);
      setOpenedModal('');
    }
  };

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
    <div className="mx-auto flex flex-col justify-center gap-4 xl:w-11/12">
      {isError && (
        <div className="my-10 text-center text-4xl text-gray-500">
          Error... Please reload page
        </div>
      )}
      {isLoading ? (
        <div className="my-10 text-center text-4xl text-gray-500">
          Loading...
        </div>
      ) : (
        <>
          <AddWriterButton
            onAddStart={() => modalOpen('add')}
            onCancel={modalClose}
          />
          <TextInput
            id="search_word"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            icon={FaSearch}
            placeholder="Search"
            required
          />
          <div className="space-y-16">
            {[
              { listName: 'main writer', list: mainWriter },
              { listName: 'sub writer', list: subWriter },
            ].map(({ listName, list }) => (
              <section key={listName}>
                <h2 className="text-3xl">{listName.toUpperCase()}</h2>
                {list.length > 0 ? (
                  <div className="my-6 flex flex-wrap gap-4">
                    {mainWriter.map((writer) => (
                      <WriterCard
                        key={writer.id ?? writer.name}
                        writer={writer}
                        onDelete={() => modalOpen(DELETE_WRITER, writer)}
                        onEdit={() => modalOpen(UPDATE_WRITER, writer)}
                      />
                    ))}
                  </div>
                ) : (
                  <h3 className="my-4 text-xl">There is no {listName}</h3>
                )}
              </section>
            ))}
          </div>
        </>
      )}
      {isBrowser && (
        <>
          <WriterDeleteModal
            writer={targetWriter}
            onDelete={onDelete}
            onCancel={modalClose}
            open={openedModal === DELETE_WRITER}
          />
          <InputWriterModal
            mode={openedModal === ADD_WRITER ? 'add' : 'update'}
            writer={targetWriter}
            open={openedModal === UPDATE_WRITER || openedModal === ADD_WRITER}
            onCancel={modalClose}
            onDone={onDone(openedModal as 'add' | 'update')}
          />
        </>
      )}
    </div>
  );
};

export default WriterPage;
