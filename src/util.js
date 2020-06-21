/**
 * 获取年月日
 * @param date 时间对象
 * @returns {{month: number, year: number, day: number}} 包含年月日的对象
 */
const getYearMonthDay = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return {
    year,
    month,
    day
  }
}

/**
 * 根据年月日创建时间对象
 * @param year 年
 * @param month 月
 * @param day 日
 * @returns {Date} 时间对象
 */
const getDate = (year, month, day = 1) => {
  return new Date(year, month, day)
}

/**
 * 判断是否两个日期是否在同一个月
 * @param date1 日期1
 * @param date2 日期2
 * @returns {boolean|boolean}
 */
const judgeCurrentMonth = (date1, date2) => {
  const { year: year1, month: month1 } = getYearMonthDay(date1)
  const { year: year2, month: month2 } = getYearMonthDay(date2)
  return month1 === month2 && year1 === year2
}

/**
 * 日期是否相同
 * @param date1 日期1
 * @param date2 日期2
 * @returns {boolean|boolean}
 */
const judgeDate = (date1, date2) => {
  // const { year: year1, month: month1, day: day1 } = getYearMonthDay(date1)
  // const { year: year2, month: month2, day: day2 } = getYearMonthDay(date2)
  // return day1 === day2 && month1 === month2 && year1 === year2
  return date1.toLocaleDateString() === date2.toLocaleDateString()
}

export default {
  getYearMonthDay,
  getDate,
  judgeCurrentMonth,
  judgeDate
}
