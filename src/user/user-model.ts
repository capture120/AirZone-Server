import mongoose from "mongoose";
import userSchema from "./user-schema";

const userModel = mongoose.model("User", userSchema);

export default userModel;