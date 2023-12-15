import { Schema, model } from "mongoose";
import { TAdmin, TAdminModel, TAdminUserName } from "./admin.interface";
import { BLOOD_GROUP, GENDER } from "./admin.constant";

const userNameSchema = new Schema<TAdminUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  middleName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
});

const adminSchema = new Schema<TAdmin, TAdminModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    designation: {
      type: String,
      required: true,
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: GENDER,
        message: "{VALUE} is not a valid gender",
      },
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BLOOD_GROUP,
        message: "{VALUE} is not a valid blood group",
      },
    },
    presentAddress: {
      type: String,
      required: [true, "Present address is required"],
    },
    permanentAddress: {
      type: String,
      required: [true, "Permanent address is required"],
    },
    profileImage: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  },
);

adminSchema.virtual("fullName").get(function () {
  return (
    this?.name?.firstName +
    " " +
    this?.name?.middleName +
    " " +
    this?.name?.lastName
  );
});

adminSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
adminSchema.pre("findOne", function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});
adminSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

adminSchema.statics.isAdminExist = async function (id: string) {
  const existingAdmin = await AdminModel.findById(id);
  console.log({ existingAdmin });
  return existingAdmin;
};

export const AdminModel = model<TAdmin, TAdminModel>("Admin", adminSchema);
