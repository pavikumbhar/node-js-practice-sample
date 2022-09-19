const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const { singAccessToken,singRefreshToken,verifyRefreshToken } = require("../config/jwt.config");
const User = require("../models/user.model");
const { authSchema } = require("../routes/validate.schema");
const redisClient =require('../config/redis.config');

/**
 *1]This is a register api 
 * */
router.post("/register", async (req, res, next) => {
    try {
            const result = await authSchema.validateAsync(req.body);
            const existingUser = await User.findOne({ email: result.email });
            if (existingUser) {
                throw createError.Conflict(`${result.email} is already been registered`);
            }
            const user = new User(result);
            const savedUser = await user.save();
            const accessToken = await singAccessToken(savedUser.id);
            const refreshToken= await singRefreshToken(savedUser.id);
            res.send({ accessToken,refreshToken });
        } catch (error) {
            console.log(error.message);
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
});

/**
 * 2]Login 
 */
router.post("/login", async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) {
            throw createError.NotFound('user is not registered');
        }

        const isMatch=await user.isValidPassword(result.password);
        if(!isMatch){
            throw createError.Unauthorized('username or password not valid');
        }
        const accessToken = await singAccessToken(user.id);
        const refreshToken= await singRefreshToken(user.id);
        res.send({ accessToken,refreshToken });
    } catch (error) {
        console.log(error.message);
        if (error.isJoi === true) return next(createError.BadRequest('Invalid username or password'))
        next(error);
    }
});

/**
 * 3] refresh-token 
 */
router.post("/refresh-token", async (req, res, next) => {
try {
    const {refreshToken}= req.body;
    if(!refreshToken){
        throw createError.BadRequest();
    }

    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await singAccessToken(userId);
    const newRefreshToken= await singRefreshToken(userId);
    res.send({ accessToken,refreshToken:newRefreshToken });

} catch (error) {
    console.log(error.message);
    next(error)
}
});

/**
 * 4] This is logout api
 */
router.delete("/logout", async (req, res, next) => {
    try {
        const {refreshToken}= req.body;
        if(!refreshToken){
            throw createError.BadRequest();
        }
        const userId = await verifyRefreshToken(refreshToken);

        redisClient.DEL(userId).then((result)=>{
            console.log(`deleting token ${result}`);
            res.sendStatus(204);
        }).catch((err)=>{
            console.log(err.message)
            throw createError.InternalServerError()
        });
    
    } catch (error) {
        console.log(error.message);
        next(error)
    }
});

module.exports = router;
