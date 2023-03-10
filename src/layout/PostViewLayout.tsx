import parse, { DOMNode, Element } from 'html-react-parser';
import NextImage from 'next/image';

import { string2css } from '@/lib/utils';

export interface PreviewProps {
  title?: string;
  tags?: string[];
  thumbnail?: string | File | null;
  content?: string;
}

export const replaceImage = {
  replace: (domNode: DOMNode) => {
    if (domNode instanceof Element && domNode.name === 'img') {
      const {
        attribs: { width, height, alt, src, style },
      } = domNode;
      return (
        <NextImage
          src={src}
          alt={alt ?? 'post image'}
          width={Number(width) || 640}
          height={Number(height) || 640}
          priority={true}
          style={{ width, height, ...string2css(style) }}
          unoptimized
        />
      );
    }
  },
};
const PostViewLayout = ({ title, tags, thumbnail, content }: PreviewProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      {thumbnail && (
        <NextImage
          className="self-center"
          src={
            typeof thumbnail === 'string'
              ? thumbnail
              : URL.createObjectURL(thumbnail)
          }
          alt="thumbnail"
          width={1000}
          height={1000}
          unoptimized
        />
      )}
      {tags?.length && (
        <div className="flex gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-md bg-primary-200 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      )}
      {title && <h1 className="my-3 text-5xl font-bold">{title}</h1>}
      {content && (
        <div
          className="unreset mt-10 px-4 leading-[1.4]"
          style={{ width: 1500 }}
        >
          {parse(content ?? '', replaceImage)}
        </div>
      )}
    </div>
  );
};

export default PostViewLayout;
