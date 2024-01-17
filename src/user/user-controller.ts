import { Express, Request, Response } from 'express';
import * as userDao from './user-dao'
import { User } from './user-schema';

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
        const newUser = await userDao.createUser({...newUserDetails});
        if (!newUser) {
            res.sendStatus(409);
        } else {
            req.session.user = newUser;
            
        }

    }
}