import  dotenv   from "dotenv";
dotenv.config();

const SERVER = {
    hostname: process.env.SERVER_HOSTNAME || 'localhost',
    port: process.env.SERVER_PORT || 7002
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'superuser';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'superuser';
const MONGO_HOST = process.env.MONGO_HOST || `localhost`;
const MONGO_PORT = process.env.MONGO_PORT || `27017`;

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    autoIndex: false,
    retryWrites: false
};

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    //url: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
    url:`mongodb://${MONGO_HOST}:${MONGO_PORT}/api-db`
};


const JWT = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
};


const config = {
    server: SERVER,
    mongo:MONGO,
    jwt:JWT

};

export default config;