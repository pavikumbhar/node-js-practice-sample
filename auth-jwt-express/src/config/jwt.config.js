const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const redisClient =require('./redis.config');


module.exports = {
    singAccessToken: (userId) => {
        console.log(`start of singAccessToken for userId :${userId}`);
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '1h',
                issuer: 'pavikumbhar.com',
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err, token) =>{
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
                
            resolve(token);
            });
        })
    }
,
verifyAccessToken:(req,res,next)=>{
        console.log('start of verifyAccessToken');
        console.log(req.headers.authorization);
        if(!req.headers.authorization) {
            console.log('dddddddddddd');
            return next(createError.Unauthorized());
            
        }

        const authHeader=req.headers.authorization;
        const bearerToken=authHeader.split(' ');
        const token=bearerToken[1];

        JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if(err){
                const message=err.name==='JsonWebTokenError'?'Unauthorized'
                                            :err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload=payload;
            next();
        });
    }
    ,
    singRefreshToken:(userId) => {
        console.log(`start of singRefreshToken for userId :${userId}`);
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1d',
                issuer: 'pavikumbhar.com',
                audience: userId,
            }
            console.log('signing refresh token');
            JWT.sign(payload, secret, options, (err, token) =>{
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    return
                }
            
            console.log('saving refresh token in redis');

            redisClient.set(userId,token, {EX: 1000,NX: true}).then((reply)=>{
                console.log('saving refresh token in success');
                resolve(token);
                return;
            }).catch((err)=>{
                    console.log('error occurred while saving refresh token ');
                    console.log(err.message);
                    reject(createError.InternalServerError());
                    return;
            });
        });
        })
    }
    ,
    verifyRefreshToken:(refreshToken)=>{
        console.log('start of verifyRefreshToken');
        return new Promise((resolve,reject)=>{
            JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
                if(err){
                    console.log(err);
                    return reject(createError.Unauthorized());
                }
                const userId=payload.aud;
                redisClient.GET(userId).then((result)=>{
                    console.log(`Getting refresh token in success result: ${result}`) ;
                    if (refreshToken !== result){
                        console.log('saved token and provided token are not same');
                        reject(createError.Unauthorized());
                        return
                    }
                    resolve(userId);
                    return;
                }).catch((err)=>{
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return;
                });
            });
        })
    }

}