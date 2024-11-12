require("dotenv").config();
const express = require("express");
const { userRouter } = require("./routes/userRouter");
require("./utils/connectDB")();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/v1/users',userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});