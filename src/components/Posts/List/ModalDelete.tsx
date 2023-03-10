import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

const ModalDelete = ({ opened, onClose, onConfirm }: Props) => {
  const [loading, setLoading] = useState(false);
  const confirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={opened} size="md" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this post?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color={loading ? 'gray' : 'failure'}
              onClick={confirm}
              disabled={loading}
            >
              {loading ? 'Loading...' : "Yes, I'm sure"}
            </Button>
            <Button color="gray" onClick={onClose}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDelete;
