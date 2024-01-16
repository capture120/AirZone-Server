import express from 'express';
import cors from 'cors';
import "dotenv/config";
import session from "express-session";
import mongoose from "mongoose";

/* connecting to local mongodb database */
// localhost is: mongodb://127.0.0.1:27017/<database-name>
const CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string;
mongoose.connect(CONNECTION_STRING);


const app = express(); 

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL, 
}
))

// configure server session after cors
const sessionOptions = {
    secret: "any string",
    resave: false,
    saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
    };
}
app.use(session(sessionOptions));
app.use(express.json()); // parse JSON from HTTP request body

app.listen(process.env.PORT || 4000);