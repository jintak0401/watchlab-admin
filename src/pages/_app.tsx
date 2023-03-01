import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'jotai';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRef } from 'react';
import { ToastContainer } from 'react-toastify';

import '@/css/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';

import LayoutWrapper from '@/components/common/LayoutWrapper';

export default function App({ Component, pageProps }: AppProps) {
  useIsLoggedIn();

  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: Infinity,
        },
      },
    })
  );
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Provider>
        <QueryClientProvider client={queryClient.current}>
          <Hydrate state={pageProps.dehydratedState}>
            <LayoutWrapper>
              <Component {...pageProps} />
            </LayoutWrapper>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
      <ToastContainer />
    </>
  );
}
