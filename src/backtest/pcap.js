import readline from 'readline'

import pcap from 'pcap'

import { fp } from '../util/fs.js'

/** This class has a reader that can read pcap files from iex historical data
 * feeds. The files above were downloaded for free and without api key on
 * (2020/09/12) from https://iextrading.com/trading/market-data/#hist-download
 * , and are not included in this repo.
 *
 * See example usage below */

export class Pcap {
  constructor(relPath) {
    this.filepath = fp(relPath)
    this.reader = pcap.createOfflineSession(this.filepath, '')
  }
}

function decodePacket(rawPacket) {
  let packet = pcap.decode.packet(rawPacket)
  packet = packet.payload.payload.payload
  let data = packet.data

  let msg_len
  let msg_type
  let time_stamp
  let symbol
  let price
  let size
  if (packet.length > 48) {
    msg_len = Number(data.readUIntLE(40, 2))
    msg_type = data.readUIntLE(42, 1)
    msg_type = String.fromCharCode(data.readUIntLE(42, 1))

    time_stamp = new Date(Number(data.readBigUInt64LE(44) / 1_000_000n))
    symbol = data.slice(52, 60).toString()
    if (packet.length > 69) {
      size = Number(data.readUIntLE(60, 4))
      if (packet.length > 72) {
        price = '$' + Number(data.readBigUInt64LE(64)) / 1e4
      }
    }
  }

  return { msg_len, msg_type, time_stamp, symbol, size, price }
}

// EXAMPLE

;(function callMe() {
  let p = new Pcap(
    '../../data/data_feeds_20200819_20200819_IEXTP1_TOPS1.6.pcap',
    // '../../data/data_feeds_20200819_20200819_IEXTP1_DEEP1.0.pcap',
  )

  p.reader.on('packet', (packet) => {
    console.log(decodePacket(packet))
  })
})()
