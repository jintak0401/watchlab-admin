import { Provider } from 'jotai';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@/css/tailwind.css';

import LayoutWrapper from '@/components/common/LayoutWrapper';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Provider>
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </Provider>
    </>
  );
}
