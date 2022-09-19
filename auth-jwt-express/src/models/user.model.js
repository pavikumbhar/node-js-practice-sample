const { mongoose } = require("mongoose")
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

});

/**
 * middleware
 */
userSchema.pre('save', async function (next) {
    try {
        console.log('Called before saving a user');
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();

    } catch (error) {
        console.log(error.message);
        next(error)
    }

});

userSchema.methods.isValidPassword=async function(password){
    try {
        return await bcrypt.compare(password,this.password);
        
    } catch (error) {
        console.log(error.message);
        throw error
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;