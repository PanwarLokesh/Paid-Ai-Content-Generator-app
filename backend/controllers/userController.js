const { message } = require("prompt");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//!----Registration-----
const register = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );
  newUser.save();
  res.json({
    status: true,
    message: "Registration was successful",
    user: {
      username,
      email,
    },
  });
});

//!-------Login--------
const login = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
      throw new Error("All fields are required");
    }
    const user = await User.findOne({email});
    if (!user) {
      res.status(401);
      throw new Error("Invalid Login Credentials");
    }

    const isMatch = await bcrypt.compare(password, user?.password);
    if(!isMatch){
      res.status(401);
      throw new Error("Invalid Login Credentials");
    } 

    const token = jwt.sign(
      {id: user?._id},
      process.env.JWT_SECRET,
      {expiresIn: "3d"}
    )
    // console.log("token",token);

    res.cookie("token",token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24*60*60*1000
    })
    
    res.json({
      status: true,
      message: "Login success",
      _id: user?._id,
      username: user?.username,
      email: user?.email,
    })

});

//!-------Logout--------
const logout = asyncHandler(async (req,res)=>{
  res.cookie("token",'',{maxAge:1});
  res.status(200).json({
    message: "Logout successful"
  })
})

//!-------user profile--------
const userProfile = asyncHandler(async (req,res)=>{
  const id= req?.user?.id
  const user = await User.findById(id).select("-password");
  if(user){
    res.status(200).json({
      status:"success",
      user
    })
  }
  else{
    res.status(404);
    throw new Error("User not found");
  }
})
module.exports = {
  register,
  login,
  logout,
  userProfile
};
