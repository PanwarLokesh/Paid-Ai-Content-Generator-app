const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { geminiApiController } = require("../controllers/geminiApiController");
const geminiApiRouter = express.Router();

geminiApiRouter.post("/generate",isAuthenticated,geminiApiController);

module.exports={
    geminiApiRouter
}