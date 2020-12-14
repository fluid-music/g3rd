const fluid = require('fluid-music')
const { AFOnset, AFReverse, AFReverseLeadIn } = fluid.techniques

const audioFiles = require('./audio-files')
const rideFiles = audioFiles.rides

rideFiles['R&B Ride 01 - Room.wav'].gainDb = -6
rideFiles['R&B Ride 02 - Close.wav'].gainDb = 12
rideFiles['R&B Ride Bell 01 - Close.wav'].gainDb = -5

const rides = {
  a: new AFOnset(rideFiles['Jazz Ride Bell 01 - Close.wav']),
  b: new AFOnset(rideFiles['Jazz Hi-Hat 10 - Close.wav']),  // played like a ride
  c: new AFOnset(rideFiles['Jazz Ride 02 - Room.wav']),
  d: new AFOnset(rideFiles['R&B Ride 01 - Room.wav']),
  // Mono Rides
  A: new AFOnset(rideFiles['R&B Ride 01 - Close.wav']),
  B: new AFOnset(rideFiles['R&B Ride 02 - Close.wav']),
  C: new AFOnset(rideFiles['R&B Ride Bell 01 - Close.wav']),
  D: new AFOnset(rideFiles['R&B Ride Bell 02 - Close.wav']),
}

const ridesReverse = {}
for (const [key, afOnset] of Object.entries(rides)) ridesReverse[key] = new AFReverse(afOnset.audioFile)

const ridesReverseLeadIn = {}
for (const [key, afOnset] of Object.entries(rides)) ridesReverseLeadIn[key] = new AFReverseLeadIn(afOnset.audioFile)

module.exports = { rides, ridesReverse, ridesReverseLeadIn }
