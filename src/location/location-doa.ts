import locationModel from "./location-model";
import { Location } from "./location-schema";

// Find Location by Title
export const findLocationByTitle = (title: String) => locationModel.findOne({ title: title });

// Find Location by Coordinates (lattitude longitude)
export const findLocationByLatLng = (lat: Number, lng: Number) => locationModel.findOne({lat: lat, lng: lng});

// Create Location
export const createLocation = (location: Location) => locationModel.create(location);