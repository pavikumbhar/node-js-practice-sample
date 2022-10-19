import  { Model,Schema, model,Document} from 'mongoose'; 
import bcrypt from 'bcrypt';

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
    email: string;
    password: string;
}

// Put all user instance methods in this interface:
interface IUserMethods extends IUser, Document {
    isValidPassword(password:string):  Promise<boolean>;
    checkPassword: (password: string) => Promise<boolean>;
}

// Create a new Model type that knows about IUserMethods...
type UserModel = Model<IUser, {}, IUserMethods>;


// 2. Create a Schema corresponding to the document interface.
// And a schema that knows about IUserMethods
const userSchema =new Schema<IUser, UserModel, IUserMethods>({
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

userSchema.method('isValidPassword', async function isValidPassword(password: string) {
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error:any) {
        console.log(error.message);
        throw error
    }
});

/**
 * 
 * @param password 
 * @returns 
 */
userSchema.methods.checkPassword= async function (password: string) :Promise<boolean>{
    console.log('checking password');
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error:any) {
        console.log(error.message);
        throw error
    }
}
/**
 * 
 */
userSchema.pre('save', async function (next) {
    try {
        console.log('Called before saving a user');
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();

    } catch (error:any) {
        console.log(error.message);
        next(error)
    }

});


// 3. Create a Model.
const User = model<IUser,UserModel>('User', userSchema);
export default User;