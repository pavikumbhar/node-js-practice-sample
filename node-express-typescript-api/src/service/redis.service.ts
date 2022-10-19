import  { createClient,RedisClientType } from 'redis';

class RedisService{
    private  redisClient: RedisClientType | undefined;

    constructor(){
        this.init();
    }

    private async init() {

        this.redisClient = createClient();

        this.redisClient .on('connect',()=>{
            console.log('on connect');
            console.log(`redis client connect to the host :${process.env.REDIS_URL}`);
        });
        
        this.redisClient .on('error',(err:any)=>{
            console.log('on error');
            console.log(`error occurred while connecting to redis : ${err.message}`);
        });
        
        this.redisClient .on('ready',()=>{
            console.log('on ready');
            console.log('redis client is ready');
        });
        
        this.redisClient .on('end',()=>{
            console.log('on end');
            console.log('redis client is quit or disconnect');
        });
        
        this.redisClient .on('reconnecting',()=>{
            console.log('on reconnecting');
            console.log('The redis client is trying to reconnect to the server.');
        });
        
        await this.redisClient.connect();
    }

    public getCache<T>(key:string):Promise<T>{
        return new Promise<T>((resolve:any,reject:any)=>{
            if(!this.redisClient) return reject('redis client not found');
            
            this.redisClient.GET(key)
            .then((result:any)=>{
                resolve(JSON.parse(result));
                return;
            }).catch((err)=>{
                    return reject(err);
            });
        });
    
    }

    public setCache(key:string,value:any){
        return new Promise((resolve:any,reject:any)=>{
            if(!this.redisClient) return reject('redis client not found');
            
            this.redisClient.SET(key,JSON.stringify(value))
            .then((reply:any)=>{
                resolve(JSON.stringify(reply));
                return;
            }).catch((err)=>{
                    return reject(err);
            });
        });
    
    }

    parseData(data:any) {
        if (!data) return {};
        if (typeof data === 'object') return data;
        if (typeof data === 'string') return JSON.parse(data);
    
        return {};
    }
}




export default new RedisService();