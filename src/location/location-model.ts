import mongoose from "mongoose";
import locationSchema from "./location-schema";

const locationModel = mongoose.model("Location", locationSchema);

export default locationModel;