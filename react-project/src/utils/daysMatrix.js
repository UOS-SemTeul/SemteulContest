import dayjs from "dayjs";

export function getMonth(year = dayjs().year(), month = dayjs().month()) {
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  const weekCount =
    (firstDayOfTheMonth + dayjs(new Date(year, month, 1)).daysInMonth()) / 7;
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(6).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  daysMatrix.push(Math.ceil(weekCount));
  return daysMatrix;
}
