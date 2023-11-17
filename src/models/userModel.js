import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true,"Please Provide your name"],
    },
    email: {
        type: String,
        required:[true,"Please Provide your email address"],
        unique :[true,"This email address is already used"],
        lowercase: true,
        validate: [validator.isEmail,"Please provide a valid email address"],
    },
    picture: {
        type: String,
        default:"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",

    },
    status: {
        type : String,
        default : "Hey there ! I am using Whatsapp.",
    },
    password: {
        type: String,
        required: [true,"Please enter your Password"],
        minLength: [6, " Password minimum Length must be 6 characters."],
        maxLength: [128, " Password maximum Length must be 128 characters."],
    },
},
    {
        collection : "users",
        timestamps : true,
    }
);

userSchema.pre('save',async function(next){
    try {
        if(this.isNew){
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(this.password,salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error)
    }
})

const UserModel = mongoose.models.UserModel || mongoose.model("UserModel",userSchema);

export default UserModel;