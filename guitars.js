const path = require('path')
const RAlign = require('./RAlign')
const info10ths = require('./wav-g-10ths')
const infoStretched = require('./wav-g-10ths-stretch')
const audioFiles = require('./audio-files')
const fluid = require('fluid-music')
const { AFReverse, AFReverseLeadIn } = require('./AFReverse')
const { AudioFile } = fluid.techniques

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

const tLibs = {
  guitar: {
    a: AudioFile.copy(g3rdWaves['A2-min-002.wav']),
    b: AudioFile.copy(g3rdWaves['B2-min-001.wav']),
    c: AudioFile.copy(g3rdWaves['C3-maj-001.wav']),
    d: AudioFile.copy(g3rdWaves['D3-maj-001.wav']),
    e: AudioFile.copy(g3rdWaves['E3-min-001.wav']),
    f: AudioFile.copy(g3rdWaves['Fs3-min-001.wav']),
    g: AudioFile.copy(g3rdWaves['G3-maj-001.wav']),
    h: AudioFile.copy(g3rdWaves['A3-min-004.wav']),
    i: AudioFile.copy(g3rdWaves['A3-min-001.wav']),
  },
  reverse: {},
  reverseLeadIn: {},
  stretch: {
    a: AudioFile.copy(g3rdSWaves['01-A2-min-003-stretch.wav'],  { markers: { onset: 0.0, release: 8.09 } }),   //[45, 45 + 15]),
    b: AudioFile.copy(g3rdSWaves['02-B2-min-004-stretch.wav'],  { markers: { onset: 0.7, release: 7.47 } }),   //[47, 47 + 15]),
    c: AudioFile.copy(g3rdSWaves['03-C3-maj-004-stretch.wav'],  { markers: { onset: 0.5, release: 7.5 } }),    //[48, 48 + 16]),
    d: AudioFile.copy(g3rdSWaves['04-D3-maj-004-stretch.wav'],  { markers: { onset: 0.0, release: 8.2 } }),    //[50, 50 + 16]),
    e: AudioFile.copy(g3rdSWaves['05-E3-min-005-stretch.wav'],  { markers: { onset: 0.0, release: 7.8 } }),    //[52, 52 + 15]),
    f: AudioFile.copy(g3rdSWaves['06-Fs3-min-005-stretch.wav'], { markers: { onset: 0.0, release: 7.18 } }),   //[54, 54 + 15]),
    g: AudioFile.copy(g3rdSWaves['07-G3-maj-002-stretch.wav'],  { markers: { onset: 0.6, release: 15.075 } }), //[55, 55 + 16]),
    h: AudioFile.copy(g3rdSWaves['08-A3-min-004-stretch.wav'],  { markers: { onset: 0.6, release: 6.29 } }),   //[57, 57 + 15]),
    i: AudioFile.copy(g3rdSWaves['09-A3-min-001-stretch.wav'],  { markers: { onset: 0.0, release: 9.06 } }),   //[57, 57 + 15]),
  },
  stretchReverse: {},
  stretchReverseLeadIn: {},
}

// guitar derivative tLibraries
for (const [key, audioFile] of Object.entries(tLibs.guitar)) tLibs.reverse[key] = new AFReverse(audioFile)
for (const [key, audioFile] of Object.entries(tLibs.guitar)) tLibs.reverseLeadIn[key] = new AFReverseLeadIn(audioFile)
// stretch derivative tLibraries
for (const [key, audioFile] of Object.entries(tLibs.stretch)) tLibs.stretchReverse[key] = new AFReverse(audioFile)
for (const [key, audioFile] of Object.entries(tLibs.stretch)) tLibs.stretchReverseLeadIn[key] = new AFReverseLeadIn(audioFile)

// Everything below this line uses the old-style sample-scan system. It will be deprecated.

for (const [basename, obj] of Object.entries(info10ths)) {
  obj.path = path.join(__dirname, obj.path)
  obj.fadeOutSeconds = 0.1
}

for (const [basename, obj] of Object.entries(infoStretched)) {
  if (!path.isAbsolute(obj.path)) obj.path = path.join(__dirname, obj.path)
  obj.fadeOutSeconds = 3.5
  obj.fadeInSeconds = 0.01
} 

const tLibrary = {
  a: new RAlign(info10ths['A2-min-002.wav']),
  b: new RAlign(info10ths['B2-min-001.wav']),
  c: new RAlign(info10ths['C3-maj-001.wav']),
  d: new RAlign(info10ths['D3-maj-001.wav']),
  e: new RAlign(info10ths['E3-min-001.wav']),
  f: new RAlign(info10ths['Fs3-min-001.wav']),
  g: new RAlign(info10ths['G3-maj-001.wav']),
  h: new RAlign(info10ths['A3-min-004.wav']),
  i: new RAlign(info10ths['A3-min-004.wav']),
}

const tLibraryStretched = {
  a: new RAlign(infoStretched['01-A2-min-003-stretch.wav'], 0, 8.09,    [45, 45 + 15]),
  b: new RAlign(infoStretched['02-B2-min-004-stretch.wav'], 0.7, 7.47,  [47, 47 + 15]),
  c: new RAlign(infoStretched['03-C3-maj-004-stretch.wav'], 0.5, 7.5,   [48, 48 + 16]),
  d: new RAlign(infoStretched['04-D3-maj-004-stretch.wav'], 0, 8.2,     [50, 50 + 16]),
  e: new RAlign(infoStretched['05-E3-min-005-stretch.wav'], 0, 7.8,     [52, 52 + 15]),
  f: new RAlign(infoStretched['06-Fs3-min-005-stretch.wav'], 0, 7.18,   [54, 54 + 15]),
  g: new RAlign(infoStretched['07-G3-maj-002-stretch.wav'], 0.6, 15.075,[55, 55 + 16]),
  h: new RAlign(infoStretched['08-A3-min-004-stretch.wav'], 0.6, 6.29,  [57, 57 + 15]),
  i: new RAlign(infoStretched['09-A3-min-001-stretch.wav'], 0, 9.06,    [57, 57 + 15])
}

module.exports = { tLibrary, tLibraryStretched, tLibs }
