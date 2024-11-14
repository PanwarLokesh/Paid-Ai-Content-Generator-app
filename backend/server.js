require("dotenv").config();
const express = require("express");
const { userRouter } = require("./routes/userRouter");
const { ErrorMessage } = require("formik");
const  errorHandler  = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");
require("./utils/connectDB")();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/users',userRouter);

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});