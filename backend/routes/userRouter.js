const express = require("express");
const { register, login, logout, userProfile } = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const userRouter = express.Router();

userRouter.post("/register",register);
userRouter.post("/login",login);
userRouter.post("/logout",logout);
userRouter.get("/userProfile",isAuthenticated,userProfile);
module.exports={
    userRouter
}