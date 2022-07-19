import User from "./../models/userSchema.js";
import ApiFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("No users found", 404));
  }

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    users,
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const newUser = await User.findById(req.params.id);
  /* Checking if the user is created or not. If not, it will throw an error. */
  if (!newUser) {
    return next(new AppError("No user found", 404));
  }

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
  });
});

export const dynamicQuery = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.dbQuery;
  if (!users) {
    return next(new AppError("No users found", 404));
  }

  res.status(200).json({
    status: "success",
    users,
  });
});

export const aggregateQuery = catchAsync(async (req, res, next) => {
  const aggregate = await User.aggregate([
    {
      $match: { age: { $gt: 21 } },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        avgAge: { $avg: "$age" },
        maxAge: { $max: "$age" },
        minAge: { $min: "$age" },
      },
    },
    {
      $sort: { avgAge: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  res.status(201).json({
    status: "success",
    aggregate,
  });
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password update", 400));
  }
  //filter out unwanted fields
  const filteredBody = filterObj(req.body, "name", "email");
  //re run validation
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    updatedUser,
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isDeleted: true });
  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
  });
});
