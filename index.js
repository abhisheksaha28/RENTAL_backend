
/****************** IMPORRTING MODULES  ************************/ 
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRoute } from './routes/user.route.js';
import { residencyRoute } from './routes/residency.route.js';
/****************** IMPORRTING DONE  ************************/ 
dotenv.config({
    path: './env'
})


/****************** SETTING UP EXPRESS APP ************************/ 

const app=express();

 

app.use(express.json())
app.use(cookieParser())
app.use(cors())



// $%$%$%%$%$ =====> USING THE ROUTES THAT WE SETUP
app.use('/user' , userRoute);
app.use('/residency',residencyRoute);

 

 

/****************** EXPRESS APP SETUP DONE   ************************/ 


/****************** DATABASE CONNECTION SETUP  ************************/ 
const DB_NAME = "RENTAL_NEW"
const connectDB = async()=>{
try {

    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    
  

} catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);//for any uncaught error
}

}




/****************** CONNECTION SETUP DONE  ************************/ 


/****************** LISTENING OF APP AND CONNECTION WITH DB  ************************/

connectDB()
.then( ()=>{
    app.listen(process.env.PORT || 2811, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch( (err)=>{
    console.log("MongoDb connetion failed",err);
})


 

