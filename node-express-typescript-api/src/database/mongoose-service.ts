import mongoose from 'mongoose';
import config from "../config/app.config"

const log=(message:string | object,other :any={})=>{
    console.log(message);
}

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useNewUrlParser: true,
        serverSelectionTimeoutMS: 5000,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)');
        mongoose.connect(config.mongo.url, this.mongooseOptions)
            .then(() => {
                log('MongoDB is connected to' +config.mongo.url);
            })
            .catch((err) => {
                console.log(err);
                const retrySeconds = 5;
                log(`MongoDB connection unsuccessful (will retry #${++this.count} after ${retrySeconds} seconds):`,err);
                setTimeout(this.connectWithRetry, retrySeconds * 1000);
            });
    };
}
export default new MongooseService();