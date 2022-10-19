import JWT, { JwtPayload } from 'jsonwebtoken';
import config from "../config/app.config";
import redisService from "../service/redis.service";

class JwtService{

    constructor(){
    }

    singAccessToken(userId:string){
        return new Promise<string>((resolve:any,reject:any)=>{
            const payload={};
            const options={
                expiresIn: '1h',
                issuer: 'pavikumbhar.com', 
                audience: userId,
            }
            JWT.sign(payload,config.jwt.accessTokenSecret as string,options,(error, token)=>{
                if(error){
                    reject(error.message);
                    return reject(error.message);
                }
                return resolve(token);
            });

        });

    }


    singRefreshToken(userId:string){
        return new Promise<string>((resolve:any,reject:any)=>{
            const payload={};
            const options={
                expiresIn: '1h',
                issuer: 'pavikumbhar.com', 
                audience: userId,
            }
            JWT.sign(payload,config.jwt.refreshTokenSecret as string,options,(error, token)=>{
                if(error){
                    console.log(error.message);
                    return reject(error.message);
                }
                console.log('saving refresh token in redis');

                    redisService.setCache(userId,token).then((reply)=>{
                        console.log(`saving refresh token in success reply :${reply}`);
                        return resolve(token)
                    }).catch((err)=>{
                            console.log('error occurred while saving refresh token ');
                            console.log(err.message);
                            return reject(err.message);
                    });
            });

        });
    }


    verifyAccessToken(accessToken:string){
        return new Promise((resolve:any,reject:any)=>{
            if (!accessToken) {
                reject('Empty access token');
                return;
            }
            JWT.verify(accessToken,config.jwt.accessTokenSecret as string,(err,payload)=>{
                if(err){
                    console.log('JwtService: '+err.message);
                    const message=err.name==='JsonWebTokenError'?'Unauthorized' :err.message;
                    return reject(message);
                }

                resolve(payload);
        });
    });
    }


    verifyRefreshToken(refreshToken :string){
        console.log('start of verifyRefreshToken');
        return new Promise<string>((resolve,reject)=>{
            JWT.verify(refreshToken,config.jwt.refreshTokenSecret as string,(err,payload)=>{
                if(err){
                    console.log('JwtService: '+err.message);
                    const message=err.name==='JsonWebTokenError'?'Unauthorized' :err.message;
                    return reject(message);
                }
                const p= payload as JwtPayload;
                let userId:string=p.aud as string;
                
                redisService.getCache(userId).then((result)=>{
                    console.log(`Getting refresh token in success result: ${result}`) ;
                    if (refreshToken !== result){
                        console.log('saved token and provided token are not same');
                        return reject('saved token and provided token are not same');
                    }
                    resolve(userId);
                    return;
                }).catch((err:any)=>{
                        console.log(err.message);
                        return reject(err.message);
                });
            });
        })
    }

}
export default new JwtService();