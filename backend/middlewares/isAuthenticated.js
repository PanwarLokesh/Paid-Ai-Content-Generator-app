const asyncHandler= require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const isAuthenticated = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token;
    if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user= await User.findById(decoded.id).select("-password");
        console.log(req.user);
        return next();
    }else{
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})
module.exports = isAuthenticated