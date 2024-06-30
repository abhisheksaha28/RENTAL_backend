import express from 'express';
import { createResidency, getAllResidencies, getParticularResidency } from '../controllers/residency.controller.js';



const router = express.Router();



/***************************     SETTING UP THE ROUTES **********************************/

//route for creating a post/resdidency
router.post("/residency" , createResidency);
//router.post("/rgister",upload{},controller)

//route for getting all the residencies
router.get("/allresidency",getAllResidencies);

//route for getting any particular residency
router.get("/:id",getParticularResidency);


/****************************** ROUTES WITH THEIR REQUES TYPES AND ENDPOINTS ARE CREATED */

export {router as residencyRoute};



//localhost:PORT/residency/allresidency
//localhost:PORT/residency/residency
//localhost:PORT/api/residency/allresidency => if we use the path as "api/residency" in index.js
//localhost:PORT/residency/667753b3269f78c2eaadffc2