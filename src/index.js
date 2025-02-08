const express = require('express');
const app = express();
const session = require('express-session');
const authRouter = require('../src/routes/auth')
const passport = require('passport');
const mongoose = require('mongoose');

require('dotenv').config();

const connectToMongoDb = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDb..'))
    .catch((error) => {
      console.log('Error in connecting to mongoDB ' + error);
      throw error;
    });
};
connectToMongoDb();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.JWT_SECRET,
  })
);

app.use(express.json()); 
app.use(express.urlencoded({extended: true}))
app.use(passport.initialize());
app.use(passport.session());
require("./config/passportConfig");

app.use('/auth', authRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('App listening on port ' + port));