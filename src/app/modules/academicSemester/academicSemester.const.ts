import {
  TAcademicSemesterCode,
  TAcademicSemesterCodeMapping,
  TAcademicSemesterName,
  TMonth,
} from "./academicSemester.interface";

export const MONTHS: TMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ACADEMIC_SEMESTER_NAME: TAcademicSemesterName[] = [
  "Autumn",
  "Fall",
  "Summer",
];
export const ACADEMIC_SEMESTER_CODE: TAcademicSemesterCode[] = [
  "01",
  "02",
  "03",
];

export const academicSemesterCodeMapping: TAcademicSemesterCodeMapping = {
  Autumn: "01",
  Summer: "02",
  Fall: "03",
};
