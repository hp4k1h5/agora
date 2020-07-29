import fs from 'fs'
import qs from 'querystring'
import fetch from 'node-fetch'
import blessed from 'neo-blessed'
import contrib from 'blessed-contrib'

// req

async function quote(sym) {
  const url = buildURL(`stock/${sym}/quote`)
  let response = await fetch(url)
  return await response.json()
}

;(async function main() {
  const sym = 'amzn'
  let data
  try {
    data = await getPrices(sym, { chartLast: 60 * 6.5 })
  } catch (e) {
    console.error(e)
    return
  }

  print(data)
})()

function table(grid, data, row, col, h, w) {
  const table = grid.set(row, col, h, w, contrib.table, {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: true,
    label: 'stonks',
    height: '30%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 10, //in chars
    columnWidth: [16, 12, 12] /*in chars*/,
  })
  table.setData(data)

  // allow control the table with the keyboard
  table.focus()
  // table.on("select", function (node) {
  //   console.log(node, node.name);
  //   // table.setData([["ok"], ...data]);
  // });
}

function map() {
  const map = grid.set(0, 0, 8, 9, contrib.map, { label: 'World Map' })
  data.forEach((ex) => {
    let diff =
      ex.gmt_diff[0] == '+'
        ? +ex.gmt_diff.substring(1)
        : -ex.gmt_diff.substring(1)
    let localTime = new Date()
    localTime = new Date(localTime.setHours(localTime.getHours() + diff))
    let openTime = ex.open.split('[')[0].split(':')
    openTime = new Date(
      Date.UTC(
        localTime.getFullYear(),
        localTime.getMonth(),
        localTime.getDate(),
        openTime[0],
        openTime[1],
      ),
    )
    openTime = new Date(openTime.setHours(openTime.getHours() + diff)).getTime()

    let closeTime = ex.close.split('[')[0].split(':')
    closeTime = new Date(
      Date.UTC(
        localTime.getFullYear(),
        localTime.getMonth(),
        localTime.getDate(),
        closeTime[0],
        closeTime[1],
      ),
    )
    closeTime = new Date(
      closeTime.setHours(closeTime.getHours() + diff),
    ).getTime()

    localTime = localTime.getTime()
    let marker = { color: 'red', char: 'X' }
    if (localTime > openTime && localTime < closeTime) {
      marker.color = 'green'
      marker.char = 'O'
    }
    console.log(ex.name, openTime, localTime, closeTime)

    map.addMarker({ ...ex.geo, ...marker })
  })
  // map.addMarker({ lon: "-79.0000", lat: "37.5000", color: "red", char: "X" });
  // grid.set(4, 4, 4, 4, blessed.box, { content: "My Box" });
}

async function getExchanges() {
  let ex = fs.readFileSync('exchanges.json', 'utf8')
  ex = JSON.parse(ex)
  let geoEx = []
  for (let i = 0; i < ex.length; i++) {
    const options = {
      query: `${ex[i].name}, ${ex[i].city}, ${ex[i].co}`,
      key: 'AIzaSyDcxEtbdI8i3veZ0ZlarRrOwbTiqSOxf64',
    }
    let r = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${qs.encode(
        options,
      )}`,
    )

    r = await r.json()
    if (!r || !r.results || !r.results.length) {
      console.log(r, ex[i].name, 'NO RESULTS')
      continue
    }

    const geometry = r.results[0].geometry.location
    geoEx.push({ ...ex[i], geo: { lon: geometry.lng, lat: geometry.lat } })
    console.log(i, geoEx.slice(-1))
  }

  fs.writeFileSync('geoEx.json', JSON.stringify(geoEx, null, 2))
}
