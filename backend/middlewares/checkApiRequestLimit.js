const asyncHandler = require("express-async-handler");
const User = require("../models/User.model");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
    console.log("hiiii");
    if(!req.user){
        res.status(401);
        throw new Error("Not Authorized");
        return 
    }
    const user= await User.findById(req.user.id);
    if(!user){
        res.status(404);
        throw new Error("User not found");
        return 
    }
    console.log("user",user);
    let requestLimit=0;
    if(user?.isTrialActive){
        requestLimit=user?.monthlyRequestCount;
        
    }
    if(user?.apiRequestCount >= requestLimit){
        throw new Error("API request limit reached, please subscribe to a plan");
    }
    next();
});

module.exports = checkApiRequestLimit;