import blessed from '@hp4k1h5/blessed'

export function abbrevNum(num) {
  if (!num) return ''
  const l = ' KMBT'
  let c = 0
  while (num > 1e3) {
    num = num / 1000
    c++
  }
  return num.toFixed(1) + l[c] || ''
}

export function table(arr, widths, j = ': ') {
  return arr
    .filter((el) => el)
    .map((el, i) => {
      const noTags = blessed.stripTags('' + el)
      let rgx
      if (noTags.length < el.length) {
        rgx = new RegExp(
          '(?<=})' + noTags.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        )
      } else {
        rgx = new RegExp(el)
      }
      if (noTags.length > widths[i]) {
        return ('' + el).replace(rgx, noTags.substring(0, widths[i]))
      } else if (widths[i]) {
        return el.replace(rgx, noTags.padEnd(widths[i]))
      } else return '' + el
    })
    .join(j)
}
