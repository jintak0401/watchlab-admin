import { WRITER_TYPE } from '@/lib/constant';

interface DrawerItemType {
  title: string;
  href?: string;
  items?: DrawerItemType[];
  root?: boolean;
}

interface WordType {
  id?: number;
  word: string;
  description: string;
}

interface GalleryBaseType {
  title: string;
  description: string;
}

interface GalleryCardType extends GalleryBaseType {
  id: number;
  image: string;
  file?: never;
}

interface GalleryEditType extends GalleryBaseType {
  id?: number;
  file: File;
  image?: never;
}

type GalleryType = GalleryCardType | GalleryEditType;

interface WriterBaseType {
  id?: number;
  name: string;
  image: string;
  file?: File;
  type: (typeof WRITER_TYPE)[number];
}

interface WriterType extends WriterBaseType {
  id: number;
}
interface PostItemType {
  slug: string;
  title: string;
  thumbnail: string;
  tags: string[];
  view: number;
  writer: {
    name: string;
    image: string;
  };
}

interface PostEditType
  extends Omit<PostItemType, 'thumbnail' | 'view' | 'writer'> {
  writer: string;
  thumbnail: string | File;
  content?: string;
}

interface PostType extends PostItemType {
  content: string;
}

export type {
  DrawerItemType,
  GalleryBaseType,
  GalleryCardType,
  GalleryEditType,
  GalleryType,
  PostEditType,
  PostItemType,
  PostType,
  WordType,
  WriterBaseType,
  WriterType,
};
