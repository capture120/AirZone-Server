import { Schema, Types } from 'mongoose';

export interface Location {
    _id: Types.ObjectId,
    lat: Number
    lng: Number
    title: String
}

const locationSchema = new Schema<Location>({
    lat: { type: Number },
    lng: { type:Number },
    title: { type:String },
}, { collection: 'location' });

export default locationSchema;