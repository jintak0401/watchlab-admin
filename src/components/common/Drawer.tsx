import drawerItems from 'data/drawerItems';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IconType } from 'react-icons';
import {
  BsFillFileRichtextFill,
  BsFillPersonFill,
  BsImages,
} from 'react-icons/bs';
import { ImBook } from 'react-icons/im';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { DrawerItemType } from '@/lib/types';

import { drawerAtom } from '@/store/drawer';

const ICONS: { [key: string]: IconType } = {
  Posts: BsFillFileRichtextFill,
  Gallery: BsImages,
  User: BsFillPersonFill,
  Dictionary: ImBook,
};

const Button = ({
  title,
  href,
  items,
  root,
  opened,
}: DrawerItemType & { opened: boolean }) => {
  const router = useRouter();

  const [{ openedItems }, setDrawerState] = useAtom(drawerAtom);

  const Icon = ICONS[title];

  const onClickItems = () => {
    if (href) {
      router.push(href);
    } else {
      if (!openedItems) return;
      const idx = openedItems.indexOf(title);
      if (idx === -1) {
        setDrawerState({ openedItems: [...openedItems, title] });
      } else {
        setDrawerState({
          openedItems: [
            ...openedItems.slice(0, idx),
            ...openedItems.slice(idx + 1),
          ],
        });
      }
    }
  };

  return (
    <div className="flex w-full flex-col">
      <button
        className={`group flex w-full w-full items-center overflow-hidden truncate rounded-md p-1 py-2 hover:bg-gray-200 ${
          !root && !opened ? 'justify-center' : 'justify-between'
        }`}
        onClick={onClickItems}
      >
        <span
          className={`flex items-center gap-4 ${
            opened && !root ? 'pl-12' : ''
          }`}
        >
          {Icon && (
            <span className="ml-2 inline-block flex justify-center">
              <Icon className="h-6 w-6 text-gray-400 group-hover:text-gray-900" />
            </span>
          )}
          {opened ? title : root ? '' : title[0]}
        </span>
        {items &&
          opened &&
          (openedItems.includes(title) ? <IoIosArrowUp /> : <IoIosArrowDown />)}
      </button>
      {items && openedItems && openedItems.includes(title) && (
        <div className="flex flex-col gap-2 pt-2">
          {items.map((item) => (
            <Button key={item.title} {...item} opened={opened} />
          ))}
        </div>
      )}
    </div>
  );
};

const Drawer = () => {
  const [{ drawerOpened }] = useAtom(drawerAtom);
  const [hovered, setHovered] = useState(false);

  const isOpened = drawerOpened || hovered;

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={`sticky top-14 flex h-[calc(100vh-56px)] flex-col items-start gap-4 self-stretch overflow-x-hidden border-r bg-white py-6 px-2 transition-width ${
        isOpened ? 'w-52' : 'w-16'
      }`}
    >
      {drawerItems.map((item) => (
        <Button key={item.title} opened={isOpened} {...item} />
      ))}
    </div>
  );
};

export default Drawer;
