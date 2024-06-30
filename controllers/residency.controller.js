import asyncHandler from "express-async-handler";
import { Residency } from "../models/residency.model.js";
//import { Error } from "mongoose";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
 


/*************************** CONTROLLER FOR CREATING THE RESIDENCY POST **********************/


const createResidency = asyncHandler(async(req,res)=>{
    //console.log("crearing residency" );

    //get and hold on the data from the useer
    const { title, description, price, country, state, district, city, address,   image, facilities, userEmail} =req.body;
    //console.log(req.body)

     

    try {

        //try finding the user from the database
        const findUser = await User.findOne( { email : userEmail } ); //({ fieldName_inDB : fieldName_ofUserInput})
        
        
        if (findUser) {
            //creating the reidency , in the database
            const residency = await Residency.create({
                //give al parameters
                title, 
                description, 
                price, 
                country, 
                state, 
                district, 
                city, 
                address, 
                  
                image, 
                facilities, 
                userEmail,
                owner: findUser._id // connect the residency to the user's ID
    
            })
             
            //saving the residency
            await residency.save();

            //add this residency to the residency lit of the creator/owner
            findUser.residencyList.push(new mongoose.Types.ObjectId(residency));

            //save this update
            await findUser.save();

            //send msg on ccreation
            res.status(201).send({
                message: "Residency created successfully",
                residency
            });


        }
        //if the user is not found
        else res.status(404).send({message:"User not found"})
        
    } catch (err) {

       
            console.error(err); // Log the actual error
            res.status(500).send({
                message: "An error occurred while creating the residency",
                error: err.message
            });
        
    }
})

/*********************** RESIDENCY CREATING CONTOLLER DONE*******************/



/************************ CONTROLLER FOR GETTING ALL THE RESIDENCIES ************/

const getAllResidencies = asyncHandler( async(req,res) => {

    try {
        
        const getResidencies = await Residency.find()
        .sort({ createdAt: -1 })//sorting the output array in descending order, latest created posts will appear at the top, the cratedt is automatically working because we aded the timestamps in the schema
        .populate("owner" , " -password -refreshToken -wishList -reservationList") // i dont want this 2 fields to be given back , or "username" if was written, then it means out of all the fields of user ony the username and the  _id(by default) will be given back , if we want to remove the id field , "-_id" ths has to be written
        .exec();//this func executes the query

        // %$%$%$%$  POPULATE => By using populate, Mongoose automatically replaces the "owner" field with the corresponding User document
        // on the side of "owner","" witjhin this quote, we can write what only particular fields from the owner we may or maynot want

        
        //send an accepted request msg
        res.status(202).send({
            message : " All Residencies",
            getResidencies
        });
    } catch (err) {
        console.error(err); // Log the actual error
            res.status(500).send({
                message: "An error occurred while fetching for all the residencies",
                error: err.message
            });
    }
})

/*********************** ALL RESIDENCY GETTING CONTOLLER DONE*******************/




/************************ CONTROLLER FOR GETTING ANY PARTICULAR RESIDENCIES ************/

const getParticularResidency = asyncHandler( async(req,res) => {
    //to get any specific residency , we have to send its _id via payload or url
    //the general method is sending the _id to url,means the api end points

    //req.body is used when the data is send through payload or raw-body
    //if _id is to be sent via url, we have to use req.params
    const {id} = req.params;

    try {
        const expectedResidency = await Residency.findOne({ _id : id})
        .populate("owner" , " -password -refreshToken -wishList -reservationList") ;

        res.status(202).send({
            message: "The residency you wanted",
            expectedResidency
        });
    } catch (err) {
        throw new Error(err.message);
        
    }

})



export { createResidency, getAllResidencies, getParticularResidency };