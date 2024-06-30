 
import mongoose,{Schema}from "mongoose";


const residencySchema = new Schema(
    {
        title: {
            type: String,
            required: true,
             
            trim: true, 
            //index: true
        },
        description: {
            type: String,
            required: true,
             
            trim: true, 
        },
        
        
        price: {
            type: Number,  
            //default:"",
        },
        country: {
            type: String,
            required: true,
             
            lowercase: true,
            trim: true, 
        },
        state: {
            type: String,
            required: true,
            
            lowercase: true,
            trim: true, 
        },
        district: {
            type: String,
            required: true,
             
            trim: true, 
        },
        city: {
            type: String,
            required: true,
             
            trim: true, 
        },
        address: {
            type: String,
            required: true,
             
            trim: true, 
        },
        //distinguishable features, to avoid the user from posting the dame room again
        //can be flat no.(if multiple room within same aprtment) / room no.(if multiple room within same house of owner)/name(of pg,house,etc.)
         
        image: [{
            type: String,//url
            required: true,
             
        }],
        facilities: {
            type: Schema.Types.Mixed,//json is acpeted
            required: true,
              
        },
        userEmail: {
            type: String,
            required: true,
            
             
        },
         
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',

        },

    },
    {
        timestamps: true
    }
)


export const Residency = mongoose.model("Residency", residencySchema)