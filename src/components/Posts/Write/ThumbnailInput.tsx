import NextImage from 'next/image';
import { ChangeEvent } from 'react';

interface Props {
  thumbnail: File | null;
  setThumbnail: (thumbnail: File | null) => void;
  className?: string;
}
const VALID_IMAGE_TYPES = ['image/png', 'image/jpeg'];
const ThumbnailInput = ({ thumbnail, setThumbnail, className = '' }: Props) => {
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !VALID_IMAGE_TYPES.includes(file.type)) return;
    setThumbnail(file);
  };

  return (
    <>
      <div className={`relative h-full w-full ${className}`}>
        {thumbnail ? (
          <NextImage
            className="absolute top-0 left-0 z-0 aspect-[191/100] w-full object-cover"
            src={URL.createObjectURL(thumbnail)}
            alt="thumbnail"
            width="1910"
            height="1000"
            unoptimized
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
      <span className="text-center">Image Ratio: 191/100</span>
    </>
  );
};

export default ThumbnailInput;
