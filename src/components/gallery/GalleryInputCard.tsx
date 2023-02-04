import { Label, Textarea, TextInput } from 'flowbite-react';
import NextImage from 'next/image';
import { ChangeEvent, FormEvent } from 'react';

interface Props {
  title: string;
  desc: string;
  image: string | File | null;
  onEditImage: (val: File) => void;
  onEditTitle: (val: string) => void;
  onEditDesc: (val: string) => void;
  onEditDone: (e: FormEvent<HTMLButtonElement>, cancel?: boolean) => void;
}

const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg'];
const GalleryInputCard = ({
  title,
  onEditTitle,
  onEditDesc,
  onEditImage,
  onEditDone,
  image,
  desc,
}: Props) => {
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !VALID_IMAGE_TYPES.includes(file.type)) return;
    onEditImage(file);
  };
  return (
    <form className="bg-white pb-4 shadow-md">
      <div className="relative aspect-square w-full">
        {image ? (
          <NextImage
            className="h-full w-full object-cover"
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
            alt={title}
            width={300}
            height={300}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-2 border-dashed bg-gray-300">
            <span>Drag and Drop a Image</span>
          </div>
        )}
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
          onChange={(e) => onEditTitle(e.target.value)}
          value={title}
          required
        />
      </div>
      <div className="mt-3 px-2">
        <Label htmlFor="card_desc" value="Description" />
        <Textarea
          className="mb-2 px-2"
          id="card_desc"
          onChange={(e) => onEditDesc(e.target.value)}
          value={desc}
          required
        />
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button className="btn" onClick={(e) => onEditDone(e, true)}>
          Cancel
        </button>
        <button type="submit" className="btn-primary btn" onClick={onEditDone}>
          Done
        </button>
      </div>
    </form>
  );
};

export default GalleryInputCard;
