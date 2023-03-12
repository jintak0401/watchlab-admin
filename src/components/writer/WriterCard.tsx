import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import { WriterType } from '@/lib/types';

import Avatar from '@/components/Avatar';

interface Props {
  writer: WriterType;
  onDelete: () => void;
  onEdit: () => void;
}
const WriterCard = ({ writer, onEdit, onDelete }: Props) => {
  return (
    <span className="group flex items-center justify-center gap-4 rounded-md border-2 border-gray-200 bg-white px-4 py-2 shadow-md">
      <Avatar file={writer.file} image={writer.image} />
      <span>{writer.name}</span>
      <span className="flex gap-2">
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
      </span>
    </span>
  );
};

export default WriterCard;
