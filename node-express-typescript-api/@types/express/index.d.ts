/*
import * as express from "express"

declare global {
    namespace Express {
        interface Request {
            payload: any
        }
    }
}
*/
import { Express } from "express-serve-static-core";
export interface TokenData {
    iat: string,
    exp: string,
    aud: string,
    iss: string
}
declare module "express-serve-static-core" {
interface Request {
    payload: any
}
}