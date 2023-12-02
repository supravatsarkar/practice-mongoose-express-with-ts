import Joi from "joi";

const createStudentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.object({
    firstName: Joi.string().required().max(20).trim(),
    middleName: Joi.string().optional(),
    lastName: Joi.string()
      .required()
      .regex(/^[a-zA-Z]+$/)
      .max(20)
      .error(errors => {
        errors.forEach(err => {
          // if(err.code["string.pattern.base"] as)
          console.log("error=>", err);
        });

        return new Error("Must be an alphabet");
      }),
  }).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.string().required(),
  email: Joi.string().required().email(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid("A", "B", "AB", "O", "-A", "-B", "-AB", "-O"),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: Joi.object({
    fatherName: Joi.string().required(),
    fatherOccupation: Joi.string().required(),
    fatherContactNo: Joi.string().required(),
    motherName: Joi.string().required(),
    motherOccupation: Joi.string().required(),
    motherContactNo: Joi.string().required(),
  }).required(),
  localGuardian: Joi.object({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
    contactNo: Joi.string().required(),
    address: Joi.string().required(),
  }).required(),
  profileImg: Joi.string().optional(),
  isActive: Joi.string().valid("active", "booked"),
  isDeleted: Joi.boolean().required(),
});

export const StudentValidation = { createStudentValidationSchema };
