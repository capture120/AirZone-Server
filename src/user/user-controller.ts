import { Express, NextFunction, Request, Response } from 'express';
import { User } from './user-schema';
import * as userDao from './user-dao';
import * as locationDao from '../location/location-doa';
import { Location } from '../location/location-schema';
import crypto from 'crypto';

function validateToken(req: Request, res: Response, next: NextFunction) {
    const csrfToken = req.headers['csrfToken'];
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
    
    app.put('/api/user/saveLocation', saveLocation);

    app.get('/api/user/details', getDetails);
}

const registerUser = async (req: Request, res: Response) => {
    const newUserDetails = req.body as User;
    const existingUser = await userDao.findByUsername(newUserDetails.username);

    if (existingUser) {
        resetSession(req);
        res.sendStatus(409);
    } else {
        const newUser: User = await userDao.createUser({...newUserDetails});
        if (newUser) {
            req.session.user = newUser;
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
        req.session.user = user;
        res.json(user);
    } else {
        resetSession(req);
        res.sendStatus(404);
    }

}

const logout = async (req: Request, res: Response) => {
    req.session.user = null;
    res.sendStatus(200);
}

const authenticate = (req: Request, res: Response) => {
    if (req.session.user) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
}

/* User's Locations */

const saveLocation = async (req: Request, res: Response) => {
    const locationDetails = req.body as Location;
    if (!req.session.user) {
        res.status(403).send('User not logged in');
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
        resetSession(req);
        res.status(403).send('User not logged in');
    }
}

function resetSession(req: Request) {
    req.session.user = null;
}

export default UserController;