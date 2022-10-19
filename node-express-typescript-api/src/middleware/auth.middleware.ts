import { NextFunction, Request, Response } from "express";
import jwtService from "../service/jwt.service";



class AuthMiddleware{

    async verifyAccessToken(req :Request,res:Response,next:NextFunction){

        const authHeader=req.headers.authorization;
        if(!authHeader){
            console.log('authHeader is missing');
            return res.send('Unauthorized');
        }
        try {
            const bearerToken=authHeader.split(' ');
            const token= bearerToken[1];
            const payload= await jwtService.verifyAccessToken(token);
            req.payload=payload;
            next();
        } catch (error:any) {
            console.log("AuthMiddleware: " +error);
            return res.send('Unauthorized');
        }
    }

}

export default new AuthMiddleware;