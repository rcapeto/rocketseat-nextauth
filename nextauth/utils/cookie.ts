import { parseCookies, setCookie, destroyCookie } from "nookies";

export const getCookies = (): Record<string, string> => {
   return parseCookies();
};

export const updateTokens = (token: string, refreshToken: string) => {
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

  setCookie(undefined, 'nextauth.token', token, { maxAge, path });
  setCookie(undefined, 'nextauth.refreshToken', refreshToken, { maxAge, path });
};

export const cleanCookies = () => {
   for(const token of ['nextauth.token', 'nextauth.refreshToken']) {
      destroyCookie(undefined, token);
   }
};