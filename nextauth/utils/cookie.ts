import { GetServerSidePropsContext } from 'next';
import { parseCookies, setCookie, destroyCookie } from "nookies";

export const getCookies = (context?: GetServerSidePropsContext): Record<string, string> => {
   return parseCookies(context);
};

export const updateTokens = (token: string, refreshToken: string, context?: GetServerSidePropsContext) => {
   //sessionStorage - se fechar o navegador, acabou o sessionStorage
   //localStorage - como estamos usando next ele não é apenas browser
   //cookies - melhor opção
   /**
   * 1. contexto da requisição => utilizado no server side render
   * 2. nome do cookie
   * 3. valor do token
   */
  const maxAge = 60 * 60 * 24 * 30; //30 days
  const path = '/'; //caminhos que tem acesso o cookie => / é para acesso global

  setCookie(context, 'nextauth.token', token, { maxAge, path });
  setCookie(context, 'nextauth.refreshToken', refreshToken, { maxAge, path });
};

export const cleanCookies = (context?: GetServerSidePropsContext) => {
   for(const token of ['nextauth.token', 'nextauth.refreshToken']) {
      destroyCookie(context, token);
   }
};