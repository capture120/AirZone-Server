import express from 'express';
import cors from 'cors';
import "dotenv/config";
import session from "express-session";
import mongoose from "mongoose";

import UserController from './user/user-controller';

/* connecting to local mongodb database */
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string;
mongoose.connect(CONNECTION_STRING);

const app = express(); 

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}
));

/* configure server session after cors */
const sessionOptions: session.SessionOptions = {
    secret: "Coop1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // expiration time set to 30 minutes
        maxAge: 30 * 24 * 60 * 1000,
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(express.json()); // parse JSON from HTTP request body

/* Setting middleware */
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
/* Register Routes */
UserController(app);
app.get('/api/healthcheck', (req, res) => res.sendStatus(200));

app.listen(process.env.PORT || 4000);