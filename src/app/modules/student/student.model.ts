import validator from "validator";
import { Schema, model } from "mongoose";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TStudentModel,
  TUserName,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: true,
    maxLength: [20, "First name maximum 20 char allow"],
    trim: true,
    validate: {
      validator: function (v: string) {
        const string = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        return v === string;
      },
      message: "First Name must be capitalize",
    },
  },
  middleName: { type: String, required: false },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => validator.isAlpha(v),
      message: props => `${props.value} must be alphabet value`,
    },
  },
  //   lastName2: { type: String, required: true },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
  },
  fatherOccupation: {
    type: String,
    required: true,
  },
  fatherContactNo: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  motherOccupation: {
    type: String,
    required: true,
  },
  motherContactNo: {
    type: String,
    required: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studentSchema = new Schema<TStudent, TStudentModel>(
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
    name: {
      type: userNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not accepted",
      },
      required: [true, "gender is required..."],
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "{VALUE} must be a valid email id.",
      },
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
      enum: ["A", "B", "AB", "O", "-A", "-B", "-AB", "-O"],
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: localGuardianSchema, required: true },
    profileImg: {
      type: String,
    },
    isActive: {
      type: String,
      enum: ["active", "block"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// hooks/middleware

// studentSchema.pre("save", async function () {
//   console.log("pre save hooks:", Number(config.bcrypt_salt_round));
//   console.log("pre save hooks:", this);
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bcrypt_salt_round),
//   );
// });
// studentSchema.post("save", function () {
//   console.log("post document hooks:", this);
// });

studentSchema.pre("find", function (next) {
  // console.log("pre find:", this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("aggregate", function (next) {
  // console.log("pre aggregate:", this.pipeline());
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

studentSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// creating custom static method
studentSchema.statics.isStudentExist = async function (id: string) {
  return StudentModel.findOne({ id });
};

// creating custom instance method
studentSchema.methods.isStudentExistByInstanceMethod = async function () {
  return await StudentModel.findOne({ id: this.id });
};
const StudentModel = model<TStudent, TStudentModel>("Student", studentSchema);

export default StudentModel;
