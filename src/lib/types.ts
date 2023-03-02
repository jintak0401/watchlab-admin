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

interface GalleryCardType {
  id: number;
  image: string;
  title: string;
  desc: string;
}

export type { DrawerItemType, GalleryCardType, WordType };
