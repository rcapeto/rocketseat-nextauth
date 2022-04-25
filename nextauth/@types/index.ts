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