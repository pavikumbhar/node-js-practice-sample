const redis = require("redis");

let redisClient;
(async () => {
redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});

redisClient.on('connect',()=>{
    console.log('on connect');
    console.log(`redis client connect to the host :${process.env.REDIS_URL}`);
});

redisClient.on('error',(err)=>{
    console.log('on error');
    console.log(`error occurred while connecting to redis : ${err.message}`);
});

redisClient.on('ready',()=>{
    console.log('on ready');
    console.log('redis client is ready');
});

redisClient.on('end',()=>{
    console.log('on end');
    console.log('redis client is quit or disconnect');
});

redisClient.on('reconnecting',()=>{
    console.log('on reconnecting');
    console.log('The redis client is trying to reconnect to the server.');
});

process.on('SIGINT',()=>{
    redisClient.quit();
});

await redisClient.connect();
})();
module.exports=redisClient;

