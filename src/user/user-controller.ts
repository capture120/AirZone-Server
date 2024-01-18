import { Express, Request, Response } from 'express';
import { User } from './user-schema';
import * as userDao from './user-dao';
import * as locationDao from '../location/location-doa';
import { Location } from '../location/location-schema';


/*
  Required Declaration Merging for Custom Types in Express session
*/
declare module 'express-session' {
    interface SessionData {
      user: User;
    }
}

const UserController = (app: Express) => {
    app.get('/api/user/:username', findUserByName);

    app.post('/api/user', registerUser);

    app.post('/api/user/signin', signin);

    app.put('/api/user/saveLocation', saveLocation);
}

const findUserByName = async (req: Request, res: Response) => {
    const username = req.params.username as string;
    if (username == '') {
        res.sendStatus(404);
        return;
    } 

    const user: User | null = await userDao.findByUsername(username);
    if (user) {
        res.json({username: user.username, savedLocations: user.savedLocations});
    } else {
        res.sendStatus(404);
    }
}

const registerUser = async (req: Request, res: Response) => {
    const newUserDetails = req.body as User;
    const existingUser = await userDao.findByUsername(newUserDetails.username);

    if (existingUser || req.session.user) {
        res.sendStatus(409);
    } else {
        const newUser: User = await userDao.createUser({...newUserDetails});
        if (!newUser) {
            res.sendStatus(409);
        } else {
            req.session.user = newUser;
            res.json({username: newUser.username, savedLocations: newUser.savedLocations})
        }

    }
}

const signin = async (req: Request, res: Response) => {
    const username = req.body.username as string;
    const password = req.body.password as string;
    /* If user is already logged in, error */
    if (username == '' || password == '' || req.session.user) {
        res.sendStatus(404);
        return;
    }

    const user: User | null = await userDao.findByUsernamePassword(username, password);
    if (user) {
        req.session.user = user;
        res.json({username: user.username, savedLocations: user.savedLocations});
    } else {
        res.sendStatus(404);
    }

}


const saveLocation = async (req: Request, res: Response) => {
    const locationDetails = req.body as Location;
    const user = authenticate(req);
    if (!user) {
        res.sendStatus(409);
        return;
    }

    /* If location exists save for user, otherwise create location then save */
    const existingLocation: Location | null = await locationDao.findLocationByLatLng(locationDetails.lat, locationDetails.lng);
    if (existingLocation) {
        const locationSaved = await userDao.saveLocation(user._id, existingLocation._id);
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
        const locationSaved = await userDao.saveLocation(user._id, createdLocation._id);
        res.json(locationSaved);
    }
}

function authenticate(req: Request): User | null {
    if (req.session.user) {
        return req.session.user;
    } else {
        return null;
    }
}

export default UserController;