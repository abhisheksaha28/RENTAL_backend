import mongoose,{Schema}from "mongoose";


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        
        
        coverImage: {
            type: String, // cloudinary url
            default:"",
        },
         
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        wishList: {
            type: Array,
            default: [],
        },
        reservationList: {
            type: Array,
            default: [],
        },
        residencyList: {
            type: Array,
            default: [],
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)


export const User = mongoose.model("User", userSchema)