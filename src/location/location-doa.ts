import locationModel from "./location-model";
import { Location } from "./location-schema";

// Find Location by Title
export const findRestaurantByTitle = (title: String) => locationModel.findOne({ title: title });

// Create Location
export const createLocation = (location: Location) => locationModel.create(location);