import { Schema, Types } from 'mongoose';

export interface Location {
    _id: Types.ObjectId
    lat: Number
    lng: Number
    zoom: Number
    title: String
    boundNorth: Number
    boundSouth: Number
    boundWest: Number
    boundEast: Number
    heatmapGridSizeX : Number
    heatmapGridSizeY: Number
}

const locationSchema = new Schema<Location>({
    lat: Number,
    lng: Number,
    zoom: Number,
    title: String,
    boundNorth: Number,
    boundSouth: Number,
    boundWest: Number,
    boundEast: Number,
    heatmapGridSizeX : Number,
    heatmapGridSizeY: Number,
}, { collection: 'location' });

export default locationSchema;