import Event from "./../models/eventSchema.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as Factory from "./handlerFactory.js";

export const createEvent = Factory.createOne(Event);

export const updateEvent = Factory.updateOne(Event);

export const getAllEvents = Factory.getAll(Event);

export const getDistance = catchAsync(async (req, res, next) => {
  const { latlon, unit } = req.params;
  const [lat, lon] = latlon.split(",");
  // const radius = unit === "mi" ? 3963.2 : 6378.1;

  if (!lat || !lon) {
    next(new AppError("Please provide latitude and longitude", 400));
  }
  //default result is in meteres...we convert to miles or km
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  const distances = await Event.aggregate([
    // {
    //   $match: {
    //     distance: { $lte: radius * 100 }
    //   }
    // }
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lon * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
        // maxDistance: radius * 100,
        // spherical: true
      },
    },

    //Project stage is just like select
    {
      $project: {
        distance: 1,
        name: 1,
        description: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    results: distances.length,
    data: {
      data: distances,
    },
  });
});

export const queryByStartDate = (req, res, next) => {
  console.log(req.params.date);
  req.query.startDate = {
    gte: new Date(req.params.date),
  };
  next();
};

export const getEvent = Factory.getOne(Event, {
  path: "users",
  select: "name",
});

export const deleteEvent = Factory.deleteOne(Event);

export const getParticipantNames = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate({
    path: "participants",
    select: "name -_id",
  });
  // console.log(event);
  if (!event) {
    return next(new AppError("No event found with the id", 404));
  }

  res.status(200).json({
    status: "success",
    data: event.participants,
  });
});
