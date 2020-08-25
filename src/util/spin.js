export const spin = (function () {
  let elements = ['▗', '▖', '▘', '▝']
  const pushift = () => {
    elements.push(elements.shift())
    return elements.join('')
  }
  return pushift
})()
