import mongoose from "mongoose";
import locationSchema from "./location-schema";

const locationModel = mongoose.model("location", locationSchema);

export default locationModel;