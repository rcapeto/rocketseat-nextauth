import { AxiosError } from "axios";

export interface SessionResponse {
   permissions: string[];
   refreshToken: string;
   roles: string[];
   token: string;
};

export type User = {
   email: string;
   permissions: string[];
   roles: string[];
};

export interface RefreshResponse {
   token: string;
   refreshToken: string;
   roles: string[];
   permissions: string[];
};

export interface MeResponse {
   token: string;
   refreshToken: string;
   roles: string[];
   permissions: string[];
};

export interface RequestQueue {
   onSuccess: (token: string) => void;
   onFailure: (err: AxiosError) => void;
}