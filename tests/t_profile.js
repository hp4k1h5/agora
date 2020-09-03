// import { profileData } from '../data/profile_data.js'
import { getProfile } from '../src/api/iex.js'
;(async () => {
  const data = await getProfile({ q: {} }).catch((e) => {
    console.log(e)
  })
  console.log(data)
})()

// import { shapeProfile } from '../src/shape/shapeIex.js'

// const shaped = shapeProfile(profileData)
