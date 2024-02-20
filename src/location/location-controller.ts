import { Express, Request, Response } from 'express';
import * as locationDao from './location-doa';
import { Types } from 'mongoose';

const LocationController = (app: Express) => {
    app.get('/api/location/:id', getLocation);
}

const getLocation = async (req: Request, res: Response) => {
    const id = new Types.ObjectId(req.params.id);
    
    try {
        const location = await locationDao.findLocationById(id);
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default LocationController;