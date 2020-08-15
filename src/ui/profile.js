import blessed from 'blessed'

export function buildProfile(ws, component, data) {
  // TODO: remove component first if necessary
  // set options
  ws.profile = ws.grid.set(...component.yxhw, blessed.box, {
    name: 'profile',
    label: 'profile',
    keys: false,
    mouse: false,
    tags: true,
    input: false,
    scrollable: false,
  })
  const width = Math.floor(ws.profile.width / 2) - 1
  const heightHalf = Math.floor(ws.profile.height / 2) - 1

  const company = blessed.text({
    parent: ws.profile,
    name: 'company',
    label: 'company',
    // inputs
    mouse: true,
    scrollable: true,
    width,
    height: heightHalf + 3,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const keyStats = blessed.text({
    parent: ws.profile,
    name: 'stats',
    label: 'stats',
    // inputs
    mouse: true,
    scrollable: true,
    // style
    width,
    left: width,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  const earnings = blessed.text({
    parent: ws.profile,
    name: 'earnings',
    label: 'earnings',
    // inputs
    mouse: true,
    scrollable: true,
    // style
    width,
    top: heightHalf + 3,
    height: heightHalf - 3,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: '#44bbee' },
    },
  })

  // set data
  if (!data) return
  company.setContent(data.company)
  keyStats.setContent(data.keyStats)
  earnings.setContent(data.earnings)
}
