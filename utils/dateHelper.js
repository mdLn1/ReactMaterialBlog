/**
 * dates comparer (not for time!)
 * @param  {Date} date1 The first date
 * @param  {Date} date2 The second date
 * @return {number} -1 = date1; 0 = dates are equal; 1 = date2
 */
function compareDates(date1, date2) {
  // date1 wins
  if (date1.getFullYear() > date2.getFullYear()) return -1;

  // date1 wins
  if (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() > date2.getMonth()
  )
    return -1;

  if (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  ) {
    // dates are equal
    if (date1.getDate() === date2.getDate()) return 0;
    // date1 wins
    else if (date1.getDate() > date2.getDate()) return -1;
  }
  // date2 wins
  return 1;
}

module.exports = {
  compareDates,
};
