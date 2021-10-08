function getTodayDate() {
  // Date 2021-02-25-17:45:34 Thu
  // year = splitDate[3] "2021"
  // month = splitDate[1] "Feb"
  // weekDay = splitDate[0] "Thu"
  // day = splitDate[2] "25"
  // time = splitDate[4] "17:45:34"

  var date = new Date();
  splitDate = String(date).split(' ');

  month = {
    "Jan": '01',
    "Feb": '02',
    "Mar": '03',
    "Apr": '04',
    "May": '05',
    "Jun": '06',
    "Jul": '07',
    "Aug": '08',
    "Sep": '09',
    "Oct": '10',
    "Nov": '11',
    "Dec": '12'
  };

  todayDate = splitDate[3] + '-' + month[splitDate[1]] + '-' +
    splitDate[2] + '(' + splitDate[0] + ')'
  return todayDate;
}

module.exports = {
  getTodayDate
}