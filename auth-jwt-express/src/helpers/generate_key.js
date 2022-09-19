const crypto =require('crypto');


const  keyOne= crypto.randomBytes(32).toString('hex');
const  keyTwo= crypto.randomBytes(32).toString('hex');

console.table({keyOne,keyTwo});
