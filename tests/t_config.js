import assert from 'assert'

import { parseConfig } from '../src/util/config.js'

assert.doesNotThrow(() => parseConfig(null, {}))

let config = { workspaces: [{ components: [{ type: 'line', time: '1d' }] }] }
assert.deepEqual(parseConfig(null, config), config)
