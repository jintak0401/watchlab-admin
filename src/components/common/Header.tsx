import { Dropdown } from 'flowbite-react';
import { useAtom } from 'jotai';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiMenuAlt1 } from 'react-icons/hi';
import { toast } from 'react-toastify';

import EN from '@/assets/country/en.svg';
import JP from '@/assets/country/jp.svg';
import KO from '@/assets/country/ko.svg';
import ZH from '@/assets/country/zh.svg';
import { userInfoAtom } from '@/store/auth';
import { drawerAtom } from '@/store/drawer';

const COUNTRY_MAP = {
  en: EN,
  jp: JP,
  ko: KO,
  zh: ZH,
};

const Profile = () => {
  const router = useRouter();
  const [userInfo] = useAtom(userInfoAtom);
  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    router.replace('/').then(() => {
      toast.success('Signed out successfully');
    });
  };

  if (!(userInfo && userInfo.image && userInfo.name && userInfo.role)) {
    return null;
  }
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      label={
        <span className="btn-ghost btn-md btn-circle btn">
          <NextImage
            className="rounded-full"
            src={userInfo.image}
            alt={'user-image'}
            width="38"
            height="38"
            unoptimized
          />
        </span>
      }
    >
      <Dropdown.Header>
        <span>{userInfo.name}</span>
      </Dropdown.Header>
      <Dropdown.Item onClick={signOut}>Sign Out</Dropdown.Item>
    </Dropdown>
  );
};

const LangDropDown = () => {
  const router = useRouter();
  const locale = router.locale;
  const CurCountry = COUNTRY_MAP[locale as keyof typeof COUNTRY_MAP];
  return (
    <Dropdown
      arrowIcon={false}
      inline={true}
      label={
        <span className="btn-ghost btn-square btn-sm btn">
          <CurCountry className="h-5 w-5 rounded-full" />
        </span>
      }
    >
      {router.locales?.map((_locale) => {
        if (locale === _locale) return null;
        const Country = COUNTRY_MAP[_locale as keyof typeof COUNTRY_MAP];
        return (
          <Dropdown.Item
            onClick={() =>
              router.push(router.asPath, undefined, { locale: _locale })
            }
            className="flex items-center gap-2"
            key={_locale}
          >
            <Country className="h-5 w-5 rounded-full" />
            {_locale}
          </Dropdown.Item>
        );
      })}
    </Dropdown>
  );
};

const Header = () => {
  const [drawerState, setDrawerState] = useAtom(drawerAtom);

  return (
    <div className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-4">
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
        <Link
          className="flex items-center gap-2 text-xl font-bold"
          href="/main"
        >
          <NextImage
            className="h-10 w-10 object-contain"
            src="/static/images/simryun.png"
            alt="logo"
            width="200"
            height="200"
            unoptimized
          />
          SIMRYUN
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <LangDropDown />
        <Profile />
      </div>
    </div>
  );
};

export default Header;
