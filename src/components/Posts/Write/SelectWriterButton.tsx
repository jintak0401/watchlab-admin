import { Button } from 'flowbite-react';

import { WriterType } from '@/lib/types';

import Avatar from '@/components/Avatar';

interface Props {
  writer: WriterType | null;
  onClick: () => void;
}
const SelectWriterButton = ({ onClick, writer }: Props) => {
  return (
    <>
      <Button color={writer ? 'gray' : 'info'} onClick={onClick}>
        {writer ? (
          <>
            <Avatar image={writer.image} />
            <span className="ml-4 text-lg">{writer.name}</span>
          </>
        ) : (
          'Select writer'
        )}
      </Button>
    </>
  );
};

export default SelectWriterButton;
