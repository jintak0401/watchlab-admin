import { Button, FileInput, Label, Modal, TextInput } from 'flowbite-react';
import React, { ChangeEvent, useEffect, useState } from 'react';

import { VALID_IMAGE_TYPES, WRITER_TYPE } from '@/lib/constant';
import { WriterBaseType, WriterType } from '@/lib/types';

import Avatar from '@/components/Avatar';

interface Props {
  mode: 'add' | 'update';
  writer?: WriterType | null;
  open: boolean;
  onCancel: () => void;
  onDone: (writer: WriterBaseType) => Promise<void>;
}

const DEFAULT_WRITER = {
  name: '',
  image: '',
  type: WRITER_TYPE[0],
};
const InputWriterModal = ({ mode, writer, open, onCancel, onDone }: Props) => {
  const [loading, setLoading] = useState(false);
  const [newWriter, setNewWriter] = useState<WriterBaseType>({
    ...(writer || DEFAULT_WRITER),
  });

  useEffect(() => {
    if (writer) {
      setNewWriter({ ...writer });
    }
  }, [writer]);

  useEffect(() => {
    if (!open) {
      setNewWriter({ ...DEFAULT_WRITER });
    }
  }, [open]);

  const inputFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !VALID_IMAGE_TYPES.includes(file.type)) return;
    setNewWriter({ ...newWriter, file });
  };

  return (
    <Modal show={open} size="md" popup={true} onClose={onCancel}>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {mode === 'add' ? 'Add New Writer' : 'Update Writer'}
          </h3>
          <center className="space-y-4">
            <FileInput onChange={inputFile} accept="image/*" />
            <Avatar file={newWriter.file} image={newWriter.image} />
          </center>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Writer name" />
            </div>
            <TextInput
              id="name"
              name="name"
              value={newWriter.name}
              onChange={(e) =>
                setNewWriter({ ...newWriter, name: e.target.value })
              }
              required={true}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Writer type" />
            </div>
            <div className="flex">
              {WRITER_TYPE.map((type) => (
                <div key={type} className="mr-4 flex items-center">
                  <input
                    id={`radio-${type}`}
                    type="radio"
                    checked={newWriter.type === type}
                    onChange={() => setNewWriter({ ...newWriter, type })}
                    value={type}
                    name="inline-radio-group"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor={`radio-${type}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
            <center>
              <Button
                className="mt-10"
                disabled={
                  loading ||
                  !newWriter.name ||
                  !(newWriter.image || newWriter.file)
                }
                color="info"
                onClick={async () => {
                  try {
                    setLoading(true);
                    await onDone(newWriter);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? 'Loading...' : 'Save'}
              </Button>
            </center>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InputWriterModal;
