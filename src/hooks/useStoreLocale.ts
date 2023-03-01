import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { NO_NEED_STORE_LOCALE_URLS } from '@/lib/constant';

const useStoreLocale = () => {
  const router = useRouter();
  useEffect(() => {
    if (NO_NEED_STORE_LOCALE_URLS.includes(router.pathname)) {
      return;
    }
    localStorage.setItem('locale', router.locale as string);
  }, [router.pathname, router.locale]);
};

export default useStoreLocale;
