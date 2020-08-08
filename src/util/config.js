import fs from 'fs'

export const config = parseConfig()

function parseConfig() {
  let config
  try {
    config = fs.readFileSync('./config.json', 'utf8')
    config = JSON.parse(config)
  } catch (e) {
    console.error(
      'err: config.json not found in root directory of iexcli, see README or https://github.com/HP4k1h5/iexcli',
    )
    process.exit(1)
  }

  if (!config.IEX_PUB_KEY || !config.IEX_PUB_KEY.length) {
    config.IEX_PUB_KEY = process.env.IEX_PUB_KEY
    if (!config.IEX_PUB_KEY || !config.IEX_PUB_KEY.length) {
      console.error(`user must provide publishable key as env var IEX_PUB_KEY, or as config.json value of "IEX_PUB_KEY".
    see README to learn how to obtain one.`)
      process.exit(1)
    }
  }

  return config
}