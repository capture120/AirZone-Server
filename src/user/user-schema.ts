import { Schema, Types } from "mongoose";

import locationSchema, { Location } from "../location/location-schema";

export interface User {
    _id: Types.ObjectId,
    username: String,
    password: String,
    savedLocations: Types.Array<Location>
}

const userSchema = new Schema<User>({
    username: {type: String, unique: true},
    password: {type: String},
    savedLocations: [locationSchema],
}, { collection: 'user'});

export default userSchema;