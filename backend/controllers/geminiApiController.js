const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const ContentHistory = require("../models/ContentHistory.model");
const User = require("../models/User.model");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

function formatContent(content) {
    // Replace "**Heading:**" with a more prominent heading style
    content = content.replace(/^\*\*(.*?)\*\*:/gm, (match, p1) => `\n🔹 ${p1.toUpperCase()}:\n`);
  
    // Replace "**Bold**" with uppercase for emphasis
    content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1.toUpperCase());
  
    // Convert "* List Item" to a bullet point
    content = content.replace(/^\* (.*?)/gm, (match, p1) => `- ${p1}`);
  
    // Handle multiple new lines for better spacing
    content = content.replace(/\n\n+/g, '\n\n');
  
    return content.trim();
  }

const geminiApiController = asyncHandler(async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400);
      throw new Error("Sentence is required.");
    }
    else{
        const result = await model.generateContent(prompt);
        const content =formatContent(result.response.text());

        const newContent = await ContentHistory.create({
            user:req?.user?._id,
            content
        })

        const userFound = await User.findById(req?.user?.id);
        userFound.history.push(newContent?._id);
        //!update api request count
        userFound.apiRequestCount += 1;
        await userFound.save();
        res.status(200).json(content);
    }
  });

module.exports = {
    geminiApiController
}