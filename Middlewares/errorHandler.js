const errorHandler = (error, req, res) => {
  console.error(error.stack);
  res
    .status(500)
    .send({
      success: false,
      message: "Server Error",
      errorMessage: error.message,
    });
};
module.exports = errorHandler;
