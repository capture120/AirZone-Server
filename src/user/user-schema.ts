import { Schema, Types } from "mongoose";

import { Location } from "../location/location-schema";

export interface User {
    _id: Types.ObjectId,
    username: String,
    password: String,
    savedLocations: Types.Array<Location>
}

const userSchema = new Schema<User>({
    username: {type: String, unique: true},
    password: {type: String},
    savedLocations: [ { type: Types.ObjectId, ref: "location" } ],
}, { collection: 'user'});

export default userSchema;