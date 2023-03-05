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

export type {
  DrawerItemType,
  GalleryBaseType,
  GalleryCardType,
  GalleryEditType,
  GalleryType,
  WordType,
  WriterBaseType,
  WriterType,
};
