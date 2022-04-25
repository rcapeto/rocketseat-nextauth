import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { RefreshResponse, RequestQueue } from '../@types';

import { cleanCookies, getCookies, updateTokens } from '../utils/cookie';

let cookies = getCookies();

//estou atualizando o post ou não
let isRefreshing = false;

//fila de requisições
let failedRequestQueue: RequestQueue[] = [];

export const api = axios.create({
   baseURL: 'http://localhost:3333',
   headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
   }
});

/**
 * Verificar se já está realizando o refresh para parar as outras requisições
 * 
*/

//rodar código antes da requisição ao backend
// 1. (fnc) o que fazer se a resposta dar sucesso, 
// 1. (fnc) o que fazer se a resposta dar erro 
api.interceptors.response.use(
   response => response, 
   (error: AxiosError) => {
      if(error.response?.status == 401) {
         if(error?.response?.data?.code === 'token.expired') {
            cookies = getCookies();

            const { 'nextauth.refreshToken': refreshToken } = cookies;
            const originalConfig = error.config;
            
            if(!isRefreshing) {
               isRefreshing = true;

               api.post<RefreshResponse>('/refresh', { refreshToken }).then(response => {
                  if(response) {
                     const { token, refreshToken } = response.data;
      
                     updateTokens(token, refreshToken);
                     //@ts-ignore
                     api.defaults.headers['Authorization'] = `Bearer ${token}`;

                     for(const failedRequest of failedRequestQueue) {
                        failedRequest.onSuccess(token);
                     }

                     failedRequestQueue = [];
                  };
               })
               .catch(err => {
                  for(const failedRequest of failedRequestQueue) {
                     failedRequest.onFailure(err);
                  }

                  failedRequestQueue = [];
               })
               .finally(() => {
                  isRefreshing = false;
               });
            }

            return new Promise((resolve, reject) => {
               failedRequestQueue.push({
                  onSuccess: (token: string) => {
                     //@ts-ignore
                     originalConfig.headers['Authorization'] = `Bearer ${token}`;
                     resolve(api(originalConfig));
                  },
                  onFailure: (err: AxiosError) => {
                     reject(err);
                  }
               });
            });
         } else {
            cleanCookies();
            Router.push('/');
            //deslogar usuário
         }
      }

      //deixar rolando o erro
      return Promise.reject(error);
   },
);