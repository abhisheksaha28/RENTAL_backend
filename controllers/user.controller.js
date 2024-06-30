import  asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';



/************************ CONTROLLER FOR REGISTERING A USER ************/

const createUser  = asyncHandler( async(req,res) =>{
    console.log("creating user");
    //get hold of the data from the user
    const{ username , email , password , coverImage} = req.body;
    console.log(email);


    //checking user exists or not
    //either the user with the username or email will esxist, bec thhey are unique
    const userExists = await User.findOne({
        $or : [{username},{email}]
    })

    //COVER IMAGE ER CODE TA LEKHA BAKI-->ai jagat oi lekha hoibo


    if(!userExists){
       

        //lets hash the password before saving 
        const salting = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salting);



        //if user does not exist, then create the user
        const user = await User.create({
            //give all the parameters
            username,
            email,
            password: hashedPassword,
            coverImage
        })

        //getting hold of the created user, because we want to send yhe user its details back to him on successfull registration
        //but some crucial fields like pasword and refresh token i dont want to give him back
        const createdUser = await User.findById(user._id).select(
            " -password -refreshToken"
        )

        //saving the user
        await user.save();
        
        //give resspone on registering
        res.status(201).send({
            message: "User registered successfully",
            user: createdUser
        });

    }
    //if user alredy exists
    else res.status(409).send({message:"User with username or email already exists"})





});
/************************ CONTROLLER FOR REGISTERING DONE ************/



/************************ CONTROLLER FOR BOOKING A VISIT ************/

const bookVisit = asyncHandler( async(req,res) => {
    const { email, date } = req.body;
  const { id } = req.params;

  try {
     
    //check whether user exits or not
    const userFound = await User.findOne( { email :email } );

    //if user exists, then do the reservation
    if (userFound) {

        //check whether the same user has already booked this residency for visit or not
        const alreadyBooked = await User.findOne({ email }).select('reservationList').exec();
    
        if (alreadyBooked && alreadyBooked.reservationList.some(visit => visit.residencyId.equals(id)))
         {
          return res.status(409).json({ message: 'This residency is already booked by you' });
        }
        else {
            //if not booked by the user, then do the reservation
          await User.updateOne(
            { email },
            { $push: { reservationList: { residencyId: new mongoose.Types.ObjectId(id), date } } }
          );
          res.status(202).send({message:"Your visit is booked successfully"});
        }
    } 

    // if user does not exists
    else {
        res.status(404).send({message:"User not found"});
    }

  } catch (err) {
    console.error(err); // Log the actual error
            res.status(500).send({
                message: "Your visit was not booked",
                error: err.message
            });
  }
});

/************************ CONTROLLER FOR BOOKING A VISIT DONE ************/



/************************ CONTROLLER FOR GETTING ALL THE BOOKINGs ************/
const getAllBookings = asyncHandler( async(req,res) => { 
    
    const {email} = req.body;

    try {
        const bookings = await User.findOne({ email }).select('reservationList').exec();
        res.status(202).send({
            message:"Your all bookings to visit",
            bookings
             
        });
    }  
    catch (err) {
        console.error(err); // Log the actual error
        res.status(500).send({
            message: "Some error while showing your bookings",
            error: err.message
        });
    }
});

/************************ CONTROLLER FOR GETTING ALL THE BOOKING DONE************/




/************************ CONTROLLER FOR DELETING A  BOOKING ************/

const cancelBooking = asyncHandler( async(req,res) => {
    const {email} = req.body;
    const {id} = req.params;

    try {
        //find user and get the reservation list from db
        const userBookings = await User.findOne({email}).select('reservationList');
        console.log(userBookings)
        console.log("and")
        console.log(userBookings.reservationList)

        //if user exists, find the index of the room by the above id from the body/params
        if (userBookings) {

            //finding the index of the partivular id from the reservation list of the user
            const index =  userBookings.reservationList.findIndex((visit) => visit.residencyId.equals( new mongoose.Types.ObjectId(id)));
            // const index = userBookings.reservationList.findIndex((visit) => {
            //     const visitId = visit.residencyId.toString();
            //     const paramId = id.toString();
            //     console.log(`Comparing visitId: ${visitId} with paramId: ${paramId}`);
            //     return visitId === paramId;
            //   });
            console.log(index)

            if (index === -1) {
                return res.status(404).json({ message: "Booking not found" });
              } 
              
              else {
                // Remove the booking from the array
                userBookings.reservationList.splice(index, 1);
                // Save the updated user document
                await userBookings.save();
                res.status(202).end("Booking cancelled successfully");
              }
            
        } 
        
        else {
            res.status(404).send({message:"User not found"})
        }

    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).send({
            message: "error",
            error: err.message
        });
    }

});

/************************ CONTROLLER FOR DELETING A  BOOKING DONE************/


/************************ CONTROLLER FOR ADD TO FAVOURITE ******************/

 const addToFav = asyncHandler( async(req,res) => {

    const {email} = req.body;
    const { resID } = req.params;

    try {
        
        //find the user
        const userIs = await User.findOne({email});

        //if user exits
        if (userIs) {
            //1.first see if this residenccy is already liked by the user or not
            //2.if alredy like, then remove fom favs
            //3.if not, then add to favs

            //1.checking
            if( userIs.wishList.includes(resID)){

                //2.remove it
                userIs.wishList = userIs.wishList.filter( (id)=> id.toString() != resID);
                //The .filter method creates a new array with all elements that pass the test implemented by the provided function
                // thee func with in this .filter(..) above, is the provided func
                //this func iterates throgh all the ids of resd, and checks whether the resID , matches or not, if output of the func is tre, ,maeans resID id is not there in wishlist(bec no id mathces this resID) , if output is fals, then this resID is present in th list
                //so the filter method provides a new wishlist array by removing/filtering out  this particular id from the array

                //save this new list of fav
                await userIs.save();

                res.status(200).send({message:"Removed from favourites"});
            }
            // 3. if not inclued in lst, then include
            else{
                userIs.wishList.push(new mongoose.Types.ObjectId(resID));

                 //save this new list of fav
                 await userIs.save();

                 res.status(202).send({ message : "Added to favourites"});
            }

            


        } 
        //if useer do not exists
        else {
            res.status(404).send({message : "User does not exists"});
        }

    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).send({
            message: "error",
            error: err.message
        });
    }
 });
 /************************ CONTROLLER FOR ADD TO FAVOURITE DONE ******************/



 /************************ CONTROLLER FOR ALL  FAVOURITES ******************/

const allFav = asyncHandler( async(req,res) => {

    const {email} = req.body;

    try {

        //check for presence of user
        const checkUser = await User.findOne({email}).select('wishList');
        if (checkUser) {
            
            res.status(202).send({
                message : "Your all favourite residencies",
                wishList : checkUser.wishList
            })
            
        } else {
            res.status(404).send({message:"User not found"});
        }

    } 
    catch (err) {
        console.error(err); // Log the actual error
        res.status(500).send({
            message: "error",
            error: err.message
        });
    }

});

 /************************ CONTROLLER FOR ALL FAVOURITE DONE ******************/


 /************************ CONTROLLER FOR MY ALL POSTED RESIDENCY ******************/

 const myResidencies = asyncHandler( async(req,res) => {
    const {email} = req.body;

    try {
        const residencies = await User.findOne({email}).select('residencyList');

        if (!residencies) {
            res.status(404).send({messagae:"Nothing posted yet"})
            
        } else {
            res.status(202).send({
                messagae : " All my posted residencies",
                myResidencies : residencies.residencyList
            })
        }


        
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).send({
            message: "error",
            error: err.message
        });
    }
 });





//export default createUser;
export {createUser , bookVisit , getAllBookings , cancelBooking ,addToFav , allFav , myResidencies};
