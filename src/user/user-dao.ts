import userModel from "./user-model";
import { User } from "./user-schema";

// Find User by Name
export const findByUsername = (username: String) => userModel.findOne({ username: username });

// Create User
export const createUser = (user: User) => userModel.create(user);