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
    origin: process.env.FRONTEND_URL, 
}
));

/* configure server session after cors */
const sessionOptions = {
    secret: "Coop1234",
    resave: false,
    saveUninitialized: false,
};

app.use(session(sessionOptions));
app.use(express.json()); // parse JSON from HTTP request body

/* Register Routes */
UserController(app);
app.get('/api/healthcheck', (req, res) => res.sendStatus(200));

app.listen(process.env.PORT || 4000);