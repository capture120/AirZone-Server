import userModel from "./user-model";
import { User } from "./user-schema";
import { Types } from "mongoose";

// Find by Username
export const findByUsername = (username: String) => userModel.findOne({ username: username });

// Find by Username & Password
export const findByUsernamePassword = (username: String, password: String) => 
            userModel.findOne({ username: username, password: password })

// Create User
export const createUser = (user: User) => userModel.create(user);

// Save Location
export const saveLocation = (userId: Types.ObjectId, location: Types.ObjectId) => 
            userModel.findByIdAndUpdate(userId, {new: true}, { $push: { savedLocations: location } });