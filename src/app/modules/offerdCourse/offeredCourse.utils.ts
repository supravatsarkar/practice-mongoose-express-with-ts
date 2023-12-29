import { TSchedule } from "./offeredCourse.interface";

export const hasTimeConflict = (
  exitingSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of exitingSchedules) {
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    const existStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existEndTime = new Date(`1970-01-01T${schedule.endTime}`);

    if (existStartTime < newEndTime && existEndTime > newStartTime) {
      return true;
    }
  }
  return false;
};
