import { createContext, FunctionComponent, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { SessionResponse, User } from "../@types";
import { api } from "../services/api";
import { cleanCookies, getCookies, updateTokens } from '../utils/cookie';

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

         updateTokens(token, refreshToken);

         //@ts-ignore
         api.defaults.headers['Authorization'] = `Bearer ${token}`;

         setUser({ permissions, roles, email });
         router.push('/dashboard');

         return data;
      } catch(err) {
         console.log('Error in signin method.');
         return null;
      }
   };

   const handleFirstVisit = async () => {
      const cookies = getCookies();
      const { 'nextauth.token': token } = cookies;

      if(token) {
         try {
            const { data } = await api.get<User>('/me');
            setUser(data);
         } catch(err) {
            setUser(undefined);
            
            cleanCookies();
            router.push('/');

            console.log('Error firstVisit function');
         }
      }
   };

   useEffect(() => {
      handleFirstVisit();
   }, []);

   return(
      <AuthContext.Provider value={{ signIn, isAuthenticated: !!user, user }}>
         { children }
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);