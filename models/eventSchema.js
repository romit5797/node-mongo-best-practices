import mongoose from "mongoose";
import validator from "validator";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the event"],
      maxLength: [50, "Name is too long"],
      minLength: [3, "Name is too short"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date for the event"],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Please provide participants"],
      },
    ],
    location: {
      //GeoJSON
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    duration: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Duration must be a positive number",
      },
    },
  },

  //Specify this part to enable virtual fields
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Indexing the start date field to fasten our search
//Indexing is resource extensive..dont use unless necessary
eventSchema.index({ startDate: 1 });

//To query point as a real point in the world
//we need to set it as 2d sphere for geoNear to work
eventSchema.index({
  location: "2dsphere",
});

export default mongoose.model("events", eventSchema);
