import type { AppProps } from 'next/app'

import '../styles/global.css';
import { AuthContextProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp
