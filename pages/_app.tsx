import React from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import '@/styles/App.scss';
import '@/styles/boxicons/boxicons.min.css';

import 'react-toastify/dist/ReactToastify.css';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer
        toastStyle={{ color: 'var(--text-color)' }}
        position="bottom-right"
        newestOnTop={false}
        autoClose={5000}
        draggable
        draggableDirection="x"
        pauseOnFocusLoss
        hideProgressBar
        closeOnClick
        pauseOnHover
      />
      <Component {...pageProps} />
    </>
  );
}
