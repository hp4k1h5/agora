import fs from 'fs'

import { getActivities } from '../src/api/alpaca.js'
import { shapeActivities } from '../src/shape/shapeAlpaca.js'
import { activitiesData } from '../data/activities_alpaca.js'
;(async function () {
  let data
  try {
    data = await getActivities({ q: {} })
  } catch (e) {
    console.log(e)
    return
  }
  // fs.writeFileSync('../data/activities_alpaca-closed.js', JSON.stringify(data))

  // data = activitiesData
  const shaped = shapeActivities(data)
  // const shaped = shapeActivities(data.filter((d) => d.symbol == 'QQQ'))
  // const shaped = shapeActivities(data) //.slice(0, 10))

  console.log(shaped)
})()
