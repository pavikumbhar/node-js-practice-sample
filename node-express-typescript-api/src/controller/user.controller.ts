
import  {Request,Response} from 'express';
import User from '../model/user.model';
import jwtService from "../service/jwt.service";

class UserController{

    /**
     1] add user */
    addUser = async (req: Request, res: Response)=>{
        try {
            const {email,password}=req.body;
            const user=new User({email,password});
            const saved = await user.save();
            const accessToken=await jwtService.singAccessToken(saved.id);
            const refreshToken= await jwtService.singRefreshToken(saved.id);
            return res.send({accessToken,refreshToken});
        } catch (error :any) {
            const msg=  error.message!=undefined? error.message:error;
            console.log(msg);
            return res.status(400).send(msg);
        }
    }

    /**
       2] login */
    login = async (req: Request, res: Response)=>{
        try {
                const {email,password}=req.body;
                const user =await User.findOne({email:email});
                if(!user){
                    throw Error('user is not registered');
                }
                const isMatch=await user.checkPassword(password);
                if(!isMatch){
                    throw Error('username or password not valid');
                }
                const accessToken=await jwtService.singAccessToken(user.id);
                const refreshToken= await jwtService.singRefreshToken(user.id);
            return res.send({accessToken,refreshToken});
            } catch (error :any) {
                const msg=  error.message!=undefined? error.message:error;
                console.log(msg);
                return res.status(400).send(msg);
        }
    }



/**
 * 3] refresh-token 
 */
    refreshToken= async (req: Request, res: Response)=>{
        try {
            const {refreshToken}= req.body;
            if(!refreshToken){
                throw Error('invalid token');
            }
        
            const userId = await jwtService.verifyRefreshToken(refreshToken);
            const accessToken = await jwtService.singAccessToken(userId);
            const newRefreshToken= await jwtService.singRefreshToken(userId);
            res.send({ accessToken,refreshToken:newRefreshToken });
            } catch (error:any) {
            const msg=error.message!=undefined? error.message:error;
            console.log(msg);
            return res.status(400).send(msg);
        }
    }

    }

export default new UserController();