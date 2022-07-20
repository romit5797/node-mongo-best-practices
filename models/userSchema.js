import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxLength: [50, "Name is too long"],
      minLength: [3, "Name is too short"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    age: {
      type: Number,
      required: true,
      min: [18, "You must be 18 and above to join this platform"],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Age must be a positive number",
      },
    },
    role: {
      type: String,
      required: false,
      default: "user",
      enum: {
        values: ["user", "admin"],
        message: "Invalid role",
      },
    },
    formerEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: undefined,
      },
    ],
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
      minLength: 6,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (v) {
          return this.password === v;
        },
        message: "Passwords do not match",
      },
      select: false,
      minLength: 6,
    },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false, required: false },
    passwordChangedAt: Date,
  },
  //Specify this part to enable virtual fields
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//this is an instance method that is available to all instances of the model
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //Password not changed
  return false;
};

//set virtual property..i.e will not be stored in db but will be returned to user
userSchema.virtual("type").get(function () {
  return this.age > 21 ? "ADULT" : "TEENAGER";
});

//Virtual field with populate
userSchema.virtual("myEvents", {
  ref: "events",
  //Foreign field is that field which contains the local field
  //which links this model to the other model
  foreignField: "participants",
  localField: "_id",
});

//Document Middleware: Runs before save() or create()
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

//Document Middleware: Runs after save() or create()
userSchema.post("save", function (doc, next) {
  // console.log(doc);
  next();
});

//Query Middleware: before a query is executed
userSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: false });
  this.start = Date.now();
  next();
});

//Query Middleware: after a query is executed
userSchema.post(/^find/, function (docs, next) {
  console.log(`Time taken to execute query: ${Date.now() - this.start}`);
  docs;
  next();
});

userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { age: { $gt: 21 } } });
  next();
});

export default mongoose.model("users", userSchema);
