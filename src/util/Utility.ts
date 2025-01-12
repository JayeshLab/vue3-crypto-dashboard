const isEmpty = function (obj: any) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false
  }
  return true
}
const ago = function (val: number) {
  val = 0 | ((Date.now() - new Date(val * 1000).getTime()) / 1000)
  const units: { [key: string]: number } = {
    sec: 60,
    min: 60,
    hr: 24,
    day: 7,
    week: 4.35,
    month: 12,
    year: 10000
  }
  for (const unit in units) {
    const result = (val % units[unit]) as number
    if (!(val = 0 | (val / units[unit])))
      return result + ' ' + (result - 1 ? unit + 's' : unit) + ' ago'
  }
}
export { isEmpty, ago }
