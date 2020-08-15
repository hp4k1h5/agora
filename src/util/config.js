import os from 'os'
import fs from 'fs'
import path from 'path'

export const validComponentTypes = [
  'repl',
  'quote',
  'line',
  'news',
  'watchlist',
  'profile',
]
export const validUnits = [
  '1d',
  '5d',
  '1m',
  '3m',
  '6m',
  'ytd',
  '1y',
  '5y',
  'max',
]
export const config = parseConfig()

export function parseConfig(location, config) {
  if (!config || !Object.keys(config).length) {
    const _configObj = loadConfig(location)
    location = _configObj.location
    config = _configObj.config
  }

  // exits on error
  vetConfig(config, location)

  return config
}

function vetConfig(config, location) {
  let errors = []
  if (!config || typeof config != 'object') errors.push('no config found')

  // vet workspaces
  if (!config.workspaces || !config.workspaces.length)
    errors.push('config must define key "workspaces')

  config.workspaces &&
    config.workspaces.forEach((workspace) => {
      workspace.components.forEach((component) => {
        // vet type
        if (!validComponentTypes.includes(component.type))
          errors.push(`component type ${component.type} not supported
valid component types are ${validComponentTypes.join(' ')}`)

        // vet time
        if (
          ['line'].includes(component.type) &&
          (!component.time || !validUnits.includes(component.time))
        )
          errors.push(`component needs a valid time
vaild component times are ${validUnits.join(' ')}`)
      })
    })

  if (
    config.watchlist &&
    (!typeof config.watchlist == 'object' ||
      !config.watchlist.length ||
      config.watchlist.every((symbol) => typeof symbol == 'string'))
  )
    errors.push('component "watchlist" must be a list of symbol names')

  if (!errors.length) return config

  // print errors and exit
  console.log(`err: the following errors were found with your config, which was found at ${location}
${errors.join('\n')}`)
}

function loadConfig(location) {
  let config
  let possibleLocations = [
    path.resolve(os.homedir(), '.config/iexcli/config.json'),
    path.resolve(path.resolve(), './config.json'),
  ]
  if (location) possibleLocations = [path.resolve(location)]

  let configLocation
  possibleLocations.forEach((loc) => {
    if (!configLocation && fs.existsSync(loc)) {
      configLocation = loc
    }
  })

  try {
    config = fs.readFileSync(configLocation, 'utf8')
    config = JSON.parse(config)
  } catch (e) {
    console.error(
      `err: config.json not found in ${
        location
          ? location
          : 'root directory of iexcli or in "~/.config/iexcli/config.json"'
      }
see README or https://github.com/HP4k1h5/iexcli`,
    )
    process.exit(1)
  }

  // check for iex api key
  if (!config.IEX_PUB_KEY || !config.IEX_PUB_KEY.length) {
    config.IEX_PUB_KEY = process.env.IEX_PUB_KEY
    if (!config.IEX_PUB_KEY || !config.IEX_PUB_KEY.length) {
      console.error(`user must provide publishable api key as env var IEX_PUB_KEY, or as config.json value of "IEX_PUB_KEY".
    see README to learn how to obtain one.`)
      process.exit(1)
    }
  }

  return { config, configLocation }
}
