const findMonth = function (monthStr) {
  let monthWord;
  if (monthStr === 1) {
    monthWord = "January";
  } else if (monthStr === 2) {
    monthWord = "February";
  } else if (monthStr === 3) {
    monthWord = "March";
  } else if (monthStr === 4) {
    monthWord = "April";
  } else if (monthStr === 5) {
    monthWord = "May";
  } else if (monthStr === 6) {
    monthWord = "June";
  } else if (monthStr === 7) {
    monthWord = "July";
  } else if (monthStr === 8) {
    monthWord = "August";
  } else if (monthStr === 9) {
    monthWord = "September";
  } else if (monthStr === 10) {
    monthWord = "October";
  } else if (monthStr === 11) {
    monthWord = "November";
  } else if (monthStr === 12) {
    monthWord = "December";
  }
  return monthWord;
};
const dateTimeModifier = function (timeStampStr, returnFormat) {
  const monthWord = findMonth(timeStampStr.slice(5, 7));
  const year = timeStampStr.slice(0, 4);
  if (returnFormat === "Month Year") {
    return monthWord + year;
  }
};

export default dateTimeModifier;
