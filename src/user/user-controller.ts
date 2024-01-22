import { Express, NextFunction, Request, Response } from 'express';
import { User } from './user-schema';
import * as userDao from './user-dao';
import * as locationDao from '../location/location-doa';
import { Location } from '../location/location-schema';
import crypto from 'crypto';


function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

function validateToken(req: Request, res: Response, next: NextFunction) {
    const csrfToken = req.headers['x-csrf-token'];
    console.log(JSON.stringify(req.headers))
    console.log(`in validateToken function\n Session csrf token ${req.session.csrfToken} | header csrf token ${csrfToken}`);
    if (req.session.csrfToken === csrfToken) {
      next();
    } else {
      res.status(403).send('CSRF token mismatch');
    }
}
/*
  Required Declaration Merging for Custom Types in Express session
*/
declare module 'express-session' {
    interface SessionData {
      user: User | null;
      csrfToken: string | null;
    }
}

const UserController = (app: Express) => {

    app.post('/api/user/register', registerUser);
    
    app.post('/api/user/signin', signin);
    
    app.post('/api/user/logout', logout)

    app.get('/api/user/authenticate', authenticate);
    
    app.put('/api/user/saveLocation', validateToken, saveLocation);

    app.get('/api/user/details', validateToken, getDetails);
}

const registerUser = async (req: Request, res: Response) => {
    const newUserDetails = req.body as User;
    const existingUser = await userDao.findByUsername(newUserDetails.username);

    if (existingUser) {
        res.sendStatus(409);
    } else {
        const newUser: User = await userDao.createUser({...newUserDetails});
        if (newUser) {
            req.session.user = newUser;
            req.session.csrfToken = generateToken();
            res.setHeader('Set-Cookie', `csrfToken=${req.session.csrfToken}; HttpOnly; Secure; SameSite=Strict`);
            res.json(newUser)
        } else {
            resetSession(req);
            res.sendStatus(409);
        }
        
    }
}

const signin = async (req: Request, res: Response) => {
    const username = req.body.username as string;
    const password = req.body.password as string;
    if (username == '' || password == '') {
        res.sendStatus(403);
        return;
    }

    const user: User | null = await userDao.findByUsernamePassword(username, password);
    if (user) {
        console.log('##################################################################')
        req.session.user = user;
        req.session.csrfToken = generateToken();
        res.json(user);
        // console.log(res.headersSent);
    } else {
        resetSession(req);
        res.sendStatus(404);
    }

}

const logout = async (req: Request, res: Response) => {
    req.session.user = null;
    req.session.csrfToken = null;

    res.setHeader('Set-Cookie', 'csrfToken=; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.sendStatus(200);
}

const authenticate = (req: Request, res: Response) => {
    const csrfToken = req.headers['x-csrf-token'];
    if (req.session.csrfToken === csrfToken) {
        res.sendStatus(200);
    } else {
        resetSession(req);
        res.sendStatus(403);
    }
}

/* User's Locations */

const saveLocation = async (req: Request, res: Response) => {
    const locationDetails = req.body as Location;
    if (!req.session.user) {
        res.sendStatus(409);
        return;
    }

    /* If location exists save for user, otherwise create location then save */
    const existingLocation: Location | null = await locationDao.findLocationByLatLng(locationDetails.lat, locationDetails.lng);
    if (existingLocation) {
        const locationSaved = await userDao.saveLocation(req.session.user._id, existingLocation._id);
        if (!locationSaved) {
            res.sendStatus(500);
            return;
        }
        res.json(locationSaved);
    } else {
        const createdLocation = await locationDao.createLocation(locationDetails);
        if (!createdLocation) {
            res.sendStatus(500);
            return;
        }
        const user = await userDao.saveLocation(req.session.user._id, createdLocation._id);
        res.json(user);
    }
}

const getDetails = async (req: Request, res: Response) => {
    if (req.session.user) {
        const userDetails = await userDao.findUserLocations(req.session.user._id);
        res.json(userDetails)
    } else {
        res.sendStatus(403);
    }
}

function resetSession(req: Request) {
    req.session.user = null;
    req.session.csrfToken = null;
}

export default UserController;