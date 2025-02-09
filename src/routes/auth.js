const express = require("express");
const passport = require("passport");

const { facebookLogin, getFbLoginUrl } = require("../controllers/fbAuth");
const { facebookCallback, getUser, logout } = require("../controllers/fbAuth-passport");
const { asyncHandler } = require("../middlewares/errorHandler");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/facebook-api", asyncHandler(getFbLoginUrl));
router.get("/facebook-api/callback", asyncHandler(facebookLogin));

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  asyncHandler(facebookCallback)
);

router.get("/user", isAuthenticated, asyncHandler(getUser));
router.get("/logout", isAuthenticated, asyncHandler(logout));

module.exports = router;
