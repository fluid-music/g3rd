const path = require('path')
const fluid = require('fluid-music')

const info10ths = require('./mp3-g-10ths')
const infoStretched = require('./mp3-g-10ths-stretch')
const G3 = require('./G3')

for (const [basename, obj] of Object.entries(info10ths)) obj.path = path.join(__dirname, obj.path)
for (const [basename, obj] of Object.entries(infoStretched)) obj.path = path.join(__dirname, obj.path)

module.exports = {
  info10ths,
  infoStretched,
  tLibrary : {
    a: new G3(info10ths['A2-min-001.mp3'], infoStretched['01-A2-min-003-stretch.mp3'], [45, 45 + 15], { onset: 0, release: 8.09 }),
    b: new G3(info10ths['B2-min-001.mp3'], infoStretched['02-B2-min-004-stretch.mp3'], [47, 47 + 15], { onset: 0.7, release: 7.47 }),
    c: new G3(info10ths['C3-maj-001.mp3'], infoStretched['03-C3-maj-004-stretch.mp3'], [48, 48 + 16], { onset: 0.5, release: 7.5 }),
    d: new G3(info10ths['D3-maj-001.mp3'], infoStretched['04-D3-maj-004-stretch.mp3'], [50, 50 + 16], { onset: 0, release: 8.2 }),
    e: new G3(info10ths['E3-min-001.mp3'], infoStretched['05-E3-min-005-stretch.mp3'], [52, 52 + 15], { onset: 0, release: 7.8 }),
    f: new G3(info10ths['Fs3-min-001.mp3'],infoStretched['06-Fs3-min-005-stretch.mp3'], [54, 54 + 15], { onset: 0, release: 7.18 }),
    g: new G3(info10ths['G3-maj-001.mp3'], infoStretched['07-G3-maj-002-stretch.mp3'], [55, 55 + 16], { onset: 0.6, release: 15.075 }),
    h: new G3(info10ths['A3-min-001.mp3'], infoStretched['08-A3-min-004-stretch.mp3'], [57, 57 + 15], { onset: 0.6, release: 6.29 }),
    i: new G3(info10ths['A3-min-004.mp3'], infoStretched['09-A3-min-001-stretch.mp3'], [57, 57 + 15], { onset: 0, release: 9.06 })
  }
}
