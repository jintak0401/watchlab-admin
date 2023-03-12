import { Label, Textarea, TextInput } from 'flowbite-react';
import NextImage from 'next/image';
import { ChangeEvent, useState } from 'react';

import { VALID_IMAGE_TYPES } from '@/lib/constant';
import { GalleryBaseType, GalleryCardType, GalleryType } from '@/lib/types';

interface Props {
  card?: GalleryCardType;
  mode: 'create' | 'update';
  onCancel?: () => void;
  onDone: (card: GalleryType) => Promise<void>;
}

const GalleryImage = ({ image, file }: { image?: string; file?: File }) => {
  const rest = {
    className: 'h-full w-full object-cover',
    alt: 'gallery image',
    width: 300,
    height: 300,
  };
  if (file) {
    return <NextImage src={URL.createObjectURL(file)} {...rest} unoptimized />;
  } else if (image) {
    return <NextImage src={image} {...rest} unoptimized />;
  } else {
    return (
      <div className="flex h-full w-full items-center justify-center border-2 border-dashed bg-gray-300">
        <span>Drag and Drop a Image</span>
      </div>
    );
  }
};

const GalleryInputCard = ({
  card,
  mode,
  onCancel = () => null,
  onDone,
}: Props) => {
  const [newGallBase, setNewGallBase] = useState<GalleryBaseType>({
    title: card?.title || '',
    description: card?.description || '',
  });
  const [image] = useState<string | undefined>(card?.image);
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !VALID_IMAGE_TYPES.includes(file.type)) {
      alert('only jpg, png, gif, webp valid');
      return;
    }
    setFile(file);
  };
  return (
    <form className="bg-white pb-4 shadow-md">
      <div className="relative aspect-square w-full">
        <GalleryImage image={image} file={file} />
        <input
          onChange={handleFile}
          className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
          type="file"
        />
      </div>
      <div className="mt-3 px-2">
        <Label htmlFor="card_title" value="Title" />
        <TextInput
          id="card_title"
          onChange={(e) => {
            setNewGallBase({ ...newGallBase, title: e.target.value });
          }}
          value={newGallBase.title}
          required
        />
      </div>
      <div className="mt-3 px-2">
        <Label htmlFor="card_desc" value="Description" />
        <Textarea
          className="mb-2 px-2"
          id="card_desc"
          onChange={(e) => {
            setNewGallBase({ ...newGallBase, description: e.target.value });
          }}
          value={newGallBase.description}
          required
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          className="btn"
          onClick={() => {
            if (mode === 'create') {
              setFile(undefined);
              setNewGallBase({ title: '', description: '' });
            } else {
              onCancel();
            }
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary btn"
          onClick={async (e) => {
            e.preventDefault();
            const data = {
              ...newGallBase,
              id: card ? card.id : undefined,
            };
            let done;
            if (file) {
              done = () => onDone({ ...data, file });
            } else if (image) {
              done = () => onDone({ ...data, image } as GalleryType);
            } else {
              throw new Error('no file or image');
            }
            try {
              setLoading(true);
              await done();
              setFile(undefined);
              setNewGallBase({ title: '', description: '' });
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
          disabled={
            !newGallBase.title ||
            !newGallBase.description ||
            (!file && !image) ||
            loading
          }
        >
          {loading ? 'Loading...' : 'Done'}
        </button>
      </div>
    </form>
  );
};

export default GalleryInputCard;
