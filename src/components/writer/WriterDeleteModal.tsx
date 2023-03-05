import { Button, Modal } from 'flowbite-react';
import NextImage from 'next/image';

import { WriterType } from '@/lib/types';

interface Props {
  writer: WriterType | null;
  onDelete: () => void;
  onCancel: () => void;
  open: boolean;
}

const WriterDeleteModal = ({ writer, onDelete, open, onCancel }: Props) => {
  return (
    <Modal show={open} size="md" popup={true} onClose={onCancel}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-4 text-xl">
            {writer && (
              <>
                <NextImage
                  src={writer.image}
                  alt={'writer image'}
                  width={50}
                  height={50}
                />
                <span>{writer.name}</span>
              </>
            )}
          </div>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this writer?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onDelete}>
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={onCancel}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WriterDeleteModal;
