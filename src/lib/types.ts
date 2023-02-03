interface DrawerItemType {
  title: string;
  href?: string;
  items?: DrawerItemType[];
  root?: boolean;
}

export type { DrawerItemType };
