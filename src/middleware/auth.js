const verifyAccess = async (req, res) => {
  try {
    if (req?.session && req?.session?.passport) {
      next();
    } else {
      res.status(403).send({
        message: "Access Denied!",
        error: "You are not signed in.",
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: error.message,
    });
  }
};

module.exports = verifyAccess;
