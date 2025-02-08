const express = require('express');
const router = express.Router();
const passport = require("passport");
const { facebookLogin, getFbLoginUrl } = require('../controllers/fbAuth');
const { facebookCallback, getUser, logout } = require("../controllers/fbAuth-passport")

// Routes for Facebook API Auth
router.get('/facebook-api', getFbLoginUrl );
router.get('/facebook-api/callback', facebookLogin);

// Routes for Facebook auth by Passport library
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), facebookCallback);
router.get("/user", getUser);
router.get("/logout", logout);

module.exports = router;
