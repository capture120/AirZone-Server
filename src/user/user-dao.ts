import userModel from "./user-model";
import { User } from "./user-schema";
import { Types } from "mongoose";

// Find by Username
export const findByUsername = (username: String) => userModel.findOne({ username: username });

// Find User's Saved Locations
export const findUserLocations = (userId: Types.ObjectId) => userModel.findById(userId).select("-password")
                                .populate('savedLocations');

// Find by Username & Password
export const findByUsernamePassword = (username: String, password: String) => 
            userModel.findOne({ username: username, password: password }).select("-password");

// Create User
export const createUser = async (user: User) => (await userModel.create(user)).$set('password', '')

// Save Location
export const saveLocation = (userId: Types.ObjectId, location: Types.ObjectId) => 
            userModel.findOneAndUpdate({_id: userId}, { $push: { savedLocations: location } }, {new: true})
            .select("-password");

// Remove Location
export const removeLocation = (userId: Types.ObjectId, locationId: Types.ObjectId) => 
            userModel.findOneAndUpdate({_id: userId}, { $pull: { savedLocations: locationId } }, {new: true})
            .select("-password");
