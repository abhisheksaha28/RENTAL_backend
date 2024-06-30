import express from 'express';
import { addToFav, allFav, bookVisit, cancelBooking, createUser, getAllBookings, myResidencies } from '../controllers/user.controller.js';



const router = express.Router();



/***************************     SETTING UP THE ROUTES **********************************/

//route for registering  a user
router.post("/register" , createUser);
//router.post("/rgister",upload{},controller)

//route for booking a visit to a plot
router.post("/bookVisit/:id",bookVisit);

//route for getting all bookings done by the user
router.get("/getAllBookings",getAllBookings)

//route for booking a visit to a plot
router.delete("/cancelBooking/:id", cancelBooking);

//route for add to favourite
router.post("/addFav/:resID",addToFav);

//route for getting all fav
router.get("/allFav",allFav);

//route for getting all my posted residencies
router.get("/myPost",myResidencies);




/****************************** ROUTES WITH THEIR REQUES TYPES AND ENDPOINTS ARE CREATED */

export {router as userRoute};


//localhost:PORT/user/register
//localhost:PORT/api/user/register => if in index.js code we want to write api/user