import { Request, Response } from "express";

import { users, checkRefreshTokenIsValid, invalidateRefreshToken } from '../database';
import { generateJwtAndRefreshToken } from '../auth';

export class RefreshController {
   async post(request: Request, response: Response) {
      const email = request.user;
      const { refreshToken } = request.body;
      
      const user = users.get(email);
      
      if (!user) {
         return response
            .status(401)
            .json({ 
            error: true, 
            message: 'User not found.'
            });
      }
      
      if (!refreshToken) {
         return response
            .status(401)
            .json({ error: true, message: 'Refresh token is required.' });
      }
      
      const isValidRefreshToken = checkRefreshTokenIsValid(email, refreshToken)
      
      if (!isValidRefreshToken) {
         return response
            .status(401)
            .json({ error: true, message: 'Refresh token is invalid.' });
      }
      
      invalidateRefreshToken(email, refreshToken)
      
      const { token, refreshToken: newRefreshToken } = generateJwtAndRefreshToken(email, {
         permissions: user.permissions,
         roles: user.roles,
      })
      
      return response.json({
         token,
         refreshToken: newRefreshToken,
         permissions: user.permissions,
         roles: user.roles,
      });
   }
}