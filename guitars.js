const audioFiles = require('./audio-files')
const fluid = require('fluid-music')
const { AFOnset, AFReverse, AFReverseLeadIn } = fluid.techniques

const g3rdWaves = audioFiles['wav-g-10ths']
for (const [basename, audioFile] of Object.entries(g3rdWaves)) {
  audioFile.fadeInSeconds = 0.05
  audioFile.fadeOutSeconds = 0.01
  audioFile.mode = fluid.techniques.AudioFile.Modes.OneVoice
}

const g3rdSWaves = audioFiles['wav-g-10ths-stretch']
for (const [basename, audioFile] of Object.entries(g3rdSWaves)) {
  audioFile.fadeInSeconds = 0.01
  audioFile.fadeOutSeconds = 3.5
}


const guitar = {
  a: new AFOnset(g3rdWaves['A2-min-002.wav']),
  b: new AFOnset(g3rdWaves['B2-min-001.wav']),
  c: new AFOnset(g3rdWaves['C3-maj-001.wav']),
  d: new AFOnset(g3rdWaves['D3-maj-001.wav']),
  e: new AFOnset(g3rdWaves['E3-min-001.wav']),
  f: new AFOnset(g3rdWaves['Fs3-min-001.wav']),
  g: new AFOnset(g3rdWaves['G3-maj-001.wav']),
  h: new AFOnset(g3rdWaves['A3-min-004.wav']),
  i: new AFOnset(g3rdWaves['A3-min-001.wav']),
}
const reverse = {}
const reverseLeadIn = {}

const stretch = {
  a: new AFOnset(g3rdSWaves['01-A2-min-003-stretch.wav'], 0.0, 8.09),   //[45, 45 + 15]),
  b: new AFOnset(g3rdSWaves['02-B2-min-004-stretch.wav'], 0.7, 7.47),   //[47, 47 + 15]),
  c: new AFOnset(g3rdSWaves['03-C3-maj-004-stretch.wav'], 0.5, 7.5),    //[48, 48 + 16]),
  d: new AFOnset(g3rdSWaves['04-D3-maj-004-stretch.wav'], 0.0, 8.2),    //[50, 50 + 16]),
  e: new AFOnset(g3rdSWaves['05-E3-min-005-stretch.wav'], 0.0, 7.8),    //[52, 52 + 15]),
  f: new AFOnset(g3rdSWaves['06-Fs3-min-005-stretch.wav'],0.0, 7.18),   //[54, 54 + 15]),
  g: new AFOnset(g3rdSWaves['07-G3-maj-002-stretch.wav'], 0.6, 15.075), //[55, 55 + 16]),
  h: new AFOnset(g3rdSWaves['08-A3-min-004-stretch.wav'], 0.6, 6.29),   //[57, 57 + 15]),
  i: new AFOnset(g3rdSWaves['09-A3-min-001-stretch.wav'], 0.0, 9.06),   //[57, 57 + 15]),
}
const stretchReverse = {}
const stretchReverseLeadIn = {}

// guitar derivative tLibraries
for (const [key, afOnset] of Object.entries(guitar)) reverse[key] = new AFReverse(afOnset.audioFile)
for (const [key, afOnset] of Object.entries(guitar)) reverseLeadIn[key] = new AFReverseLeadIn(afOnset.audioFile)
// stretch derivative tLibraries
for (const [key, afOnset] of Object.entries(stretch)) stretchReverse[key] = new AFReverse(afOnset.audioFile)
for (const [key, afOnset] of Object.entries(stretch)) stretchReverseLeadIn[key] = new AFReverseLeadIn(afOnset.audioFile)

module.exports = { guitar, reverse, reverseLeadIn, stretch, stretchReverse, stretchReverseLeadIn }
