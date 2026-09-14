// Define errors controller functions

// Test route for 500 errors
const testErrorPage = (req, res, next) => {
  const err = new Error("This is a test error");
  err.status = 500;
  next(err);
};

// Export errors controller functions
export { testErrorPage };
