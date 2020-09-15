import fs from 'fs'
import readline from 'readline'

import { fp } from '../util/fs.js'

// The Log class is used to read write messages to file.
//
// Log().log(obj) creates a write stream that logs javascript objects as jsonl.
//
// Log().read() creates a read stream and returns an async generator function
//
// see example below for usage

/** @param relPath (string) relative path to log file.  If the file does not
 * exist it will be created on instantiation of the Log instance.
 *
 * @param overwrite (bool) if not true, all logs will appended to existing log
 * found at relPath, otherwise a new file will be created whenever this Log is
 * instantiated
 *
 * */

export class Log {
  constructor(relPath, overwrite) {
    this.filepath = fp(relPath)
    this.logger = (function (_this) {
      if (!fs.existsSync(_this.filepath) || overwrite) {
        fs.openSync(_this.filepath, 'w')
        fs.writeFileSync(_this.filepath, '')
      }

      return fs.createWriteStream(_this.filepath, {
        flags: overwrite ? 'r+' : 'a+',
      })
    })(this)
    this.reader = readline.createInterface({
      input: fs.createReadStream(this.filepath, {}),
      console: false,
    })
  }

  log(line) {
    this.logger.write(JSON.stringify(line) + '\n')
  }

  read() {
    async function* read(_this) {
      for await (let line of _this.reader) {
        line = JSON.parse(line)
        yield line
      }
    }
    return read(this)
  }
}

// EXAMPLE

// callMe()
function callMe() {
  // instantiate a new log write stream
  const log = new Log('../../data/log/test_log.jsonl', true)
  //                   relative filepath               overwrite previous log file
  //                                                   otherwise will append to log

  // add lines to log. all text is JSON.stringify()'ed
  log.log({ hello: 'world', date: new Date() })
  log.log({ hello: 'world', date: new Date() })
  log.log({ hello: 'world', date: new Date() })

  // read log back with a read stream generator function
  ;(async function () {
    // create read stream
    let reader = log.read()
    // read next
    let rn = await reader.next()
    while (!rn.done) {
      // all text is JSON.parsed()'ed by the generator
      console.log(rn.value)
      rn = await reader.next()
    }
  })()
}
