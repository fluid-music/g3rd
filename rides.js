const path = require('path')
const { techniques } = require('fluid-music')
const rides = require('./rides-info')

const techniqueFromBaseName = (basename, gainDb = 0) => {
  const info = rides[basename]
  const fullPath = path.join(__dirname, info.path)
  return new techniques.AudioFile({ path: fullPath, gainDb })
}

const tLibrary = {
  a: techniqueFromBaseName('Jazz Ride Bell 01 - Close.wav'),
  b: techniqueFromBaseName('Jazz Hi-Hat 10 - Close.wav'), // played like a ride
  c: techniqueFromBaseName('Jazz Ride 02 - Room.wav'),
  d: techniqueFromBaseName('R&B Ride 01 - Room.wav', -6),
  // Mono Rides
  A: techniqueFromBaseName('R&B Ride 01 - Close.wav'),
  B: techniqueFromBaseName('R&B Ride 02 - Close.wav', 12),
  C: techniqueFromBaseName('R&B Ride Bell 01 - Close.wav', -5),
  D: techniqueFromBaseName('R&B Ride Bell 02 - Close.wav'),
}

module.exports = { tLibrary }
