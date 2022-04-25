import { Request, Response, NextFunction } from 'express';

import { users } from '../database';
import { CreateSessionDTO } from '../types';
import { generateJwtAndRefreshToken } from '../auth';

export class SessionsController {
   async post(request: Request, response: Response, next: NextFunction) {
      const { email, password } = request.body as CreateSessionDTO;
 
      const user = users.get(email);
   
      if (!user || password !== user.password) {
      return response
         .status(401)
         .json({ 
            error: true, 
            message: 'E-mail or password incorrect.'
         });
      }
   
      const { token, refreshToken } = generateJwtAndRefreshToken(email, {
      permissions: user.permissions,
      roles: user.roles,
      })
   
      return response.json({
      token,
      refreshToken,
      permissions: user.permissions,
      roles: user.roles,
      });
   }
};