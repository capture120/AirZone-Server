import { Schema, Types } from "mongoose";

export interface User {
    _id: Types.ObjectId,
    username: String,
    password: String,
    savedLocations: Types.ObjectId[] // Array<Location>
}

const userSchema = new Schema<User>({
    username: {type: String, unique: true},
    password: {type: String},
    savedLocations: [ { type: Types.ObjectId, ref: "location" } ],
}, { collection: 'user'});

export default userSchema;