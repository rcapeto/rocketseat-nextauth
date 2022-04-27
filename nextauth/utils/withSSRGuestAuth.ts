import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { getCookies, cleanCookies } from './cookie';

export function withSSRAuth<T>(fnc: GetServerSideProps<T>) {
   return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
      const { 
         'nextauth.token': token, 
         'nextauth.refreshToken': refreshToken  
      } = getCookies(context);

      if(!token) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }

      try {
        return await fnc(context);
      } catch(err) {
        cleanCookies(context);

        return {
          redirect: {
            destination: '/',
            permanent: false,
          }
        }
      }
   };
}