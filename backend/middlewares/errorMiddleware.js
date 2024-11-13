

const errorHandler = (error,req,res,next) => {
    console.log("inside error handler ", res.statusCode)
    const statusCode = res.statusCode ===200 ? 500 : res.statusCode;
    console.log(statusCode);
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : {}
    })
}

module.exports = errorHandler
