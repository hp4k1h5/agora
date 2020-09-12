import pcap from 'pcap'
const session = pcap.createOfflineSession(
  '../../data/data_feeds_20200819_20200819_IEXTP1_TOPS1.6.pcap',
  // '../../data/data_feeds_20200819_20200819_IEXTP1_DEEP1.0.pcap',
  '',
)

/** This file can read pcap files from iex historical data feeds. The files
 * above were downloaded for free and without api key on (2020/09/12) from
 * https://iextrading.com/trading/market-data/#hist-download , and are not
 * included in this repo.
 *
 * Use `node pcap.js` from this directory to dump iex message data to term, or
 * adapt for your own purposes, and be sure to update the filepath according to
 * your file location. Eventualy agora will include a backtesting mechanism and
 * this is a possible source of free data for doing such */

session.on('packet', (rawPacket) => {
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

  console.log(msg_len, msg_type, time_stamp, symbol, size, price)
})
