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

export type {
  DrawerItemType,
  GalleryBaseType,
  GalleryCardType,
  GalleryEditType,
  GalleryType,
  WordType,
};
