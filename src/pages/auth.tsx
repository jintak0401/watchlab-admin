import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import * as querystring from 'querystring';
import { useEffect } from 'react';

import { LOCALE_KEY, LOGIN_PAGE_URL, MAIN_PAGE_URL } from '@/lib/constant';

import { userInfoAtom } from '@/store/auth';

export default function AuthPage() {
  const router = useRouter();
  const [_, setUserInfo] = useAtom(userInfoAtom);

  useEffect(() => {
    const query = router.asPath.split('?')[1];
    const { accessToken, refreshToken, image, name, role } =
      querystring.parse(query);
    if (!accessToken || !refreshToken || !image || !name || !role) {
      router.replace(LOGIN_PAGE_URL).then(() => {
        alert('Login Failed');
      });
    } else {
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);
      setUserInfo({
        image: image as string,
        name: name as string,
        role: role as string,
      });

      router.replace(MAIN_PAGE_URL, undefined, {
        locale: localStorage.getItem(LOCALE_KEY) || router.defaultLocale,
      });
    }
  }, []);
}
