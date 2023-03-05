import { Button } from 'flowbite-react';
import { FaUserPlus } from 'react-icons/fa';

interface Props {
  onAddStart: () => void;
  onCancel: () => void;
}
const AddWriterButton = ({ onAddStart }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        onClick={onAddStart}
        color="gray"
        className="flex items-center justify-center gap-2"
      >
        <FaUserPlus className="h-10 w-10" />
        <span className="text-2xl font-bold">Add new writer</span>
      </Button>
    </div>
  );
};

export default AddWriterButton;
