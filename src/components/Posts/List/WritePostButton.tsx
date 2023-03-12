import { Button } from 'flowbite-react';
import { useRouter } from 'next/router';
import { FaBook } from 'react-icons/fa';

const WritePostButton = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        onClick={() => router.push('/posts/write')}
        color="gray"
        className="flex items-center justify-center gap-2"
      >
        <FaBook className="h-10 w-10" />
        <span className="text-2xl font-bold">Write new post</span>
      </Button>
    </div>
  );
};

export default WritePostButton;
