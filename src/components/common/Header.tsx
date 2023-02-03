import metadata from 'data/metadata';
import { Dropdown } from 'flowbite-react';
import { useAtom } from 'jotai';
import { HiMenuAlt1 } from 'react-icons/hi';

import EN from '@/assets/country/en.svg';
import JP from '@/assets/country/jp.svg';
import KO from '@/assets/country/ko.svg';
import ZH from '@/assets/country/zh.svg';
import { drawerAtom } from '@/store/drawer';
import { langAtom } from '@/store/language';

const COUNTRY_MAP = {
  en: EN,
  jp: JP,
  ko: KO,
  zh: ZH,
};

const Header = () => {
  const [drawerState, setDrawerState] = useAtom(drawerAtom);
  const [lang, setLang] = useAtom(langAtom);
  const CurCountry = COUNTRY_MAP[lang as keyof typeof COUNTRY_MAP];

  return (
    <div className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between border-b bg-white px-4">
      <button
        className="btn-ghost btn-square btn-sm btn"
        onClick={() =>
          setDrawerState({
            drawerOpened: !drawerState.drawerOpened,
          })
        }
      >
        <HiMenuAlt1 className="h-6 w-6" />
      </button>
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={
          <span className="btn-ghost btn-square btn-sm btn">
            <CurCountry className="h-5 w-5 rounded-full" />
          </span>
        }
      >
        {metadata.lang.map((_lang) => {
          if (lang === _lang) return null;

          const Country = COUNTRY_MAP[_lang as keyof typeof COUNTRY_MAP];
          return (
            <Dropdown.Item
              onClick={() => setLang(_lang)}
              className="flex items-center gap-2"
              key={_lang}
            >
              <Country className="h-5 w-5 rounded-full" />
              {_lang}
            </Dropdown.Item>
          );
        })}
      </Dropdown>
    </div>
  );
};

export default Header;
