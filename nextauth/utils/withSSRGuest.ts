import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { getCookies} from './cookie';

export function withSSRGuest<T>(fnc: GetServerSideProps<T>) {
   return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
      const { 
         'nextauth.token': token, 
         'nextauth.refreshToken': refreshToken  
      } = getCookies(context);

      if(token) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          }
        }
      }

      return await fnc(context);
   };
}