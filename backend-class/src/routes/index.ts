import express from 'express';

import { addUserInformationToRequest, checkAuthMiddleware  } from '../middleware';

import { SessionsController } from '../controllers/SessionsController';
import { RefreshController } from '../controllers/RefreshControler';
import { MeController } from '../controllers/MeController';

const sessionController = new SessionsController();
const refreshController = new RefreshController();
const meController = new MeController();

export const route = express.Router();

//login do usuário
route.post('/sessions', sessionController.post);

//gera um novo token, se o token enviado for válido
route.post('/refresh', addUserInformationToRequest, refreshController.post);

//retorna informações do usuário
route.get('/me', checkAuthMiddleware, meController.get);