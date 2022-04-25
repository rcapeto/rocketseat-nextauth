import { createContext, FunctionComponent, ReactNode, useContext, useState } from "react";
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';

import { SessionResponse, User } from "../@types";
import { api } from "../services/api";

type Credentials = {
   email: string;
   password: string;
}

type AuthContextData = {
   signIn(credentials: Credentials): Promise<SessionResponse | null>;
   isAuthenticated: boolean;
   user: User | undefined;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
   const [user, setUser] = useState<User>();

   const router = useRouter();
   
   const signIn = async ({ email, password }: Credentials) => {
      try {
         const { data } = await api.post<SessionResponse>('/sessions', { email, password });
         const { permissions, roles, token, refreshToken } = data;

         //sessionStorage - se fechar o navegador, acabou o sessionStorage
         //localStorage - como estamos usando next ele não é apenas browser
         //cookies - melhor opção
         /**
          * 1. contexto da requisição => utilizado no server side render
          * 2. nome do cookie
          * 3. valor do token
          */

         setCookie(undefined, 'nextauth.token', token, { 
            maxAge: 60 * 60 * 24 * 30, //30 days
            path: '/', //caminhos que tem acesso o cookie => / é para acesso global
         });
         setCookie(undefined, 'nextauth.refreshToken', refreshToken), {
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
         };

         setUser({ permissions, roles, email });
         router.push('/dashboard');

         return data;
      } catch(err) {
         console.log('Error in signin method.');
         return null;
      }
   };

   return(
      <AuthContext.Provider value={{ signIn, isAuthenticated: !!user, user }}>
         { children }
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);