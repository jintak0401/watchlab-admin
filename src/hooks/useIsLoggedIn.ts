import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { LOGIN_PAGE_URL, NO_NEED_LOGIN_URLS } from '@/lib/constant';

const useIsLoggedIn = () => {
  const router = useRouter();
  useEffect(() => {
    if (NO_NEED_LOGIN_URLS.includes(router.pathname)) {
      return;
    }
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      router.replace(LOGIN_PAGE_URL).then(() => {
        alert('You are not logged in. Please login.');
      });
    }
  }, [router.pathname]);
};

export default useIsLoggedIn;
