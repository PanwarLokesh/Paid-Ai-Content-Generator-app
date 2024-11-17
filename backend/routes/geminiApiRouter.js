const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { geminiApiController } = require("../controllers/geminiApiController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");
const geminiApiRouter = express.Router();

geminiApiRouter.post("/generate",isAuthenticated,checkApiRequestLimit,geminiApiController);

module.exports={
    geminiApiRouter
}