import express, {Request, Response,NextFunction} from "express";
import bodyParser from 'body-parser';
import http from 'http';
import config from "./config/app.config";
//require ('./database/mongo.database.config')
import mongooseService from "./database/mongoose-service";
import authMiddleware from "./middleware/auth.middleware";
import { CommonRoutesConfig } from "./route/common.routes.config";
import { UsersRoutes } from "./route/users.routes.config";



const app: express.Application = express();
const server:http.Server=http.createServer(app);
mongooseService.getMongoose(); // load db

app.use(bodyParser.json());


/**routes */
const routes: Array<CommonRoutesConfig> = [];
routes.push(new UsersRoutes(app));

/**
 * This is a simple route to make sure everything is working properly
 * */
const runningMessage = `Server running at http://${config.server.hostname}:${config.server.port}`;
app.get('/', authMiddleware.verifyAccessToken, (req: Request, res: Response) => {
    console.log('AuthRequest.payload',req.payload);
    res.status(200).send({runningMessage});
});

app.use((req:Request, res:Response, next:NextFunction) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});

server.listen(config.server.port,()=>{
    console.info(runningMessage);
    routes.forEach((route: CommonRoutesConfig) => {
        console.info(`Routes configured for ${route.getName()}`);
    });
});