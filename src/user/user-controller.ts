import { Express, Request, Response } from 'express';
import * as userDao from './user-dao'
import { User } from './user-schema';

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
}

const findUserByName = async (req: Request, res: Response) => {
    const username = req.params.username as string;

    if (username == '' || null) {
        res.sendStatus(404);
    } else {
        const user = await userDao.findByUsername(username);
        res.json(user);
    }
}

const registerUser = async (req: Request, res: Response) => {
    const newUserDetails = req.body as User;
    const existingUser = await userDao.findByUsername(newUserDetails.username);
    // @ts-ignore
    if (existingUser) {
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

export default UserController;