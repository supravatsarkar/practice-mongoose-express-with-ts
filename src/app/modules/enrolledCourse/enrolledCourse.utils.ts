export const calculateGradeAndGradePoint = (totalMarks: number) => {
  const result = {
    grade: "NA",
    gradePoints: 0,
  };

  /**
   * 0 - 19 = "F"
   * 20-39 = "D"
   * 40-59 = "C"
   * 60-79 = "B"
   * 80-100  ="A"
   */

  if (totalMarks >= 0 && totalMarks <= 19) {
    result.grade = "F";
    result.gradePoints = 0.0;
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    result.grade = "D";
    result.gradePoints = 2.0;
  } else if (totalMarks >= 40 && totalMarks <= 59) {
    result.grade = "C";
    result.gradePoints = 3.0;
  } else if (totalMarks >= 60 && totalMarks <= 79) {
    result.grade = "B";
    result.gradePoints = 4.0;
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result.grade = "A";
    result.gradePoints = 4.5;
  }

  return result;
};
