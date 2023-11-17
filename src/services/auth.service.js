import createHttpError from "http-errors";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserModel } from "../models/index.js";

//env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;


export const createUser = async(userData)=> {
    const {name, email, picture, status, password} = userData;

//check if fields are empty
if(!name || !email || !password){
    throw createHttpError.BadRequest("Please fill all fields.");
}

//check name length
if(!validator.isLength(name,{
    min:2,
    max:16,
})
) {
    throw createHttpError.BadRequest("Name must between 2 & 16 characters.");
}

//check status length
if(status && status.length > 64)
    {
       throw createHttpError.BadRequest("Please make sure your status is less than 64 characteres.");
    }

//check if email is valid
if(!validator.isEmail(email)){
    throw createHttpError.BadRequest("Please make sure to provide valid email address.");
}

//check if user already exists
const checkDB = await UserModel.findOne({email});
if(checkDB){
    throw createHttpError.Conflict("This email already exists.");
}

//check password length
if(!validator.isLength(password,
    {min: 6,
    max: 128}
    )){
        throw createHttpError.BadRequest("Please make sure your password is b/w 6 & 128 characters");
    }

//hash password --->to be done in user model




//adding user to database
    const user = await new UserModel({
        name,
        email,
        picture: picture || DEFAULT_PICTURE,
        status: status || DEFAULT_STATUS,
        password,
    }).save();

return user;
};

export const signUser = async (email, password) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
  
    //check if user exist
    if (!user) throw createHttpError.NotFound("Invalid credentials.");
  
    //compare passwords
    let passwordMatches = await bcrypt.compare(password, user.password);
  
    if (!passwordMatches) throw createHttpError.NotFound("Invalid credentials.");
  
    return user;
  };