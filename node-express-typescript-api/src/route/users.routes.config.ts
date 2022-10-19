import {CommonRoutesConfig} from './common.routes.config';
import express from 'express';
import userController from "../controller/user.controller";

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes() {

        this.app .route(`/auth/user`)
        .post(userController.addUser);

        this.app .route(`/auth/login`)
        .post(userController.login);

        this.app .route(`/auth/refresh-token`)
        .post(userController.refreshToken);


        

        return this.app;
    }
}