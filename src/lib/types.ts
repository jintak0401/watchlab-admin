interface DrawerItemType {
  title: string;
  href?: string;
  items?: DrawerItemType[];
  root?: boolean;
}

interface WordType {
  word: string;
  desc: string;
}

export type { DrawerItemType, WordType };
