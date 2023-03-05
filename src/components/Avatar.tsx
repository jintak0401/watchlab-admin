import NextImage from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  image?: string;
  file?: File;
  width?: number;
  height?: number;
}
const Avatar = ({ image, file, width, height }: Props) => {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(file ? URL.createObjectURL(file) : image);

  useEffect(() => {
    setSrc(file ? URL.createObjectURL(file) : image);
  }, [file, image]);

  if (!src) {
    return null;
  }

  return (
    <div className="relative">
      {src && (
        <NextImage
          className="rounded-full border-2 border-gray-200 object-cover"
          onLoadingComplete={() => setLoading(false)}
          src={src}
          alt={'avatar'}
          width={width || 60}
          height={height || 60}
          style={{
            width: `${width || 60}px`,
            height: `${height || 60}px`,
          }}
          unoptimized
        />
      )}
      {loading && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 animate-pulse rounded-full bg-gray-200"
          style={{ width: `${width || 60}px`, height: `${height || 60}px` }}
        />
      )}
    </div>
  );
};

export default Avatar;
