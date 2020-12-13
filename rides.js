
const { AFReverse, AFReverseLeadIn } = require('./AFReverse')
const audioFiles = require('./audio-files')
const rideFiles = audioFiles.rides

rideFiles['R&B Ride 01 - Room.wav'].gainDb = -6
rideFiles['R&B Ride 02 - Close.wav'].gainDb = 12
rideFiles['R&B Ride Bell 01 - Close.wav'].gainDb = -5

const rides = {
  a: rideFiles['Jazz Ride Bell 01 - Close.wav'],
  b: rideFiles['Jazz Hi-Hat 10 - Close.wav'],  // played like a ride
  c: rideFiles['Jazz Ride 02 - Room.wav'],
  d: rideFiles['R&B Ride 01 - Room.wav'],
  // Mono Rides
  A: rideFiles['R&B Ride 01 - Close.wav'],
  B: rideFiles['R&B Ride 02 - Close.wav'],
  C: rideFiles['R&B Ride Bell 01 - Close.wav'],
  D: rideFiles['R&B Ride Bell 02 - Close.wav'],
}

const ridesReverse = {}
for (const [key, audioFile] of Object.entries(rides)) ridesReverse[key] = new AFReverse(audioFile)

const ridesReverseLeadIn = {}
for (const [key, audioFile] of Object.entries(rides)) ridesReverseLeadIn[key] = new AFReverseLeadIn(audioFile)

module.exports = { rides, ridesReverse, ridesReverseLeadIn }
