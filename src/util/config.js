import os from 'os'
import fs from 'fs'
import path from 'path'

import { defaults } from './defaults.js'

export const validComponentTypes = [
  'repl',
  'quote',
  'chart',
  'news',
  'watchlist',
  'profile',
  'list',
  'sectors',
  'account',
]
export const validUnits = [
  '1d',
  '5d',
  '5dm',
  '1m',
  '1mm',
  '3m',
  '6m',
  'ytd',
  '1y',
  '5y',
  'max',
]

const __dirname = path.dirname(new URL(import.meta.url).pathname)
export const validIndicators = JSON.parse(
  fs.readFileSync(path.join(__dirname, './technicals.json'), 'utf8'),
)

export const config = parseConfig()

export function parseConfig(location, config) {
  if (!config || !Object.keys(config).length) {
    const _configObj = loadConfig(location)
    location = _configObj.configLocation
    config = _configObj.config
  }

  // exits on error
  vetConfig(config, location)

  return config
}

// accumulate errors and dump at the end, unless there is no config
function vetConfig(config, location) {
  let errors = []
  if (!config || typeof config != 'object') {
    return errors.push('no config found')
  }

  // vet workspaces
  if (!config.workspaces || !config.workspaces.length) {
    errors.push('config must define key "workspaces')
  }

  config.workspaces.forEach((workspace) => {
    workspace.components.forEach((component) => {
      // vet type
      if (!validComponentTypes.includes(component.type)) {
        errors.push(`component type ${component.type} not supported
valid component types are ${validComponentTypes.join(' ')}`)
      }
      const needsSymbol = ['chart', 'quote', 'profile']
      if (needsSymbol.includes(component.type) && !component.symbol) {
        errors.push(`component type ${component.type} needs a "symbol" key`)
      }
      const needsTime = ['chart']
      if (needsTime.includes(component.type) && !component.time) {
        errors.push(`component type ${component.type} needs a "time" key`)
      }

      // merge repl
      if (component.type == 'repl') {
        // build repl separately.
        workspace.repl = { ...defaults.repl, ...component }
      }
    })
    if (!workspace.repl) {
      workspace.repl = defaults.repl
    }
  })

  if (
    config.watchlist &&
    (!typeof config.watchlist == 'object' ||
      !config.watchlist.length ||
      !config.watchlist.every((symbol) => typeof symbol == 'string'))
  ) {
    errors.push('component "watchlist" must be a list of symbol names')
  }

  // check for iex api key
  if (!config.IEX_PUB_KEY || !config.IEX_PUB_KEY.length) {
    config.IEX_PUB_KEY = process.env.IEX_PUB_KEY
    if (!config.IEX_PUB_KEY || !config.IEX_PUB_KEY.length) {
      errors.push(`user must provide publishable api key as env var IEX_PUB_KEY, or as config.json value of "IEX_PUB_KEY".
    see README to learn how to obtain one.`)
    }
  }

  // check for alpaca keys
  if (!config['APCA_API_KEY_ID'] || !config['APCA_API_KEY_ID'].length) {
    config['APCA_API_KEY_ID'] = process.env.APCA_API_KEY_ID
  }
  if (!config['APCA_API_SECRET_KEY'] || !config['APCA_API_SECRET_KEY'].length) {
    config['APCA_API_SECRET_KEY'] = process.env.APCA_API_SECRET_KEY
  }
  if (
    (!!config['APCA_API_KEY_ID'] && !!config['APCA_API_KEY_ID'].length) ^
    (!!config['APCA_API_SECRET_KEY'] && !!config['APCA_API_SECRET_KEY'].length)
  ) {
    errors.push(
      `user must provide both alpaca keys ALPACA_API_ID, and ALPACA_SECRET_KEY`,
    )
  }

  // return config
  if (!errors.length) return config

  // or print errors and exit
  console.error(`err: the following errors were found with your config, which was found at ${location}
${errors.join('\n')}`)
  process.exit(1)
}

function loadConfig(location) {
  let config
  let possibleLocations = [
    path.resolve(os.homedir(), '.config/iexcli/config.json'),
    path.resolve(path.join(__dirname, '../../config.json')),
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
      `err: config.json not found in any of ${possibleLocations.join('\n- ')}

see README or https://github.com/HP4k1h5/iexcli`,
    )
    process.exit(1)
  }

  return { config, configLocation }
}
