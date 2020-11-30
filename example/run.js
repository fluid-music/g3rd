const fluid = require('fluid-music')
const g3rd = require('@fluid-music/g3rd')
const session = new fluid.FluidSession({
  bpm: 64,
  tLibrary: g3rd.tLibrary,
  dLibrary: new Array(10).fill(0).map((_, i) => { return { trimDb: -18 + i*2 } }),
  r: '1 2 3 4 5 6 7 ',
  // d:     '965864965732544',
}, [
  { name: 'G3', children: [
    { name: 'G3g' },
    { name: 'G3s' },
    { name: 'G3r' },
  ]},
])

g3rd.tLibrary.x = new fluid.techniques.TrackAutomation({ paramKey: 'width', value: 1 })
g3rd.tLibrary.y = new fluid.techniques.TrackAutomation({ paramKey: 'width', value: -0.9 })

session.editCursorTime = 7/4
session.insertScore({
  r:       '1 2 3 4 5 6 7 ',
  G3:     ['a--bc-h---',
           'a--bc-g---',
           'a--b-ce---',],
  G3s:  'x        y',
})
session.insertScore({
  G3s: ['a--bc-h---']
})
session.insertScore({
  G3r: ['a--bc-g---']
})
// session.insertScore({
//   'G3-s': ['........h---']
// })
session.finalize()

async function run() {
  await session.saveAsReaperFile('out.RPP')
  console.warn('OK: out.RPP')
  await session.saveAsTracktionFile('out.tracktionedit')
  console.warn('OK: out.tracktionedit')
}
run()
  .then(() => console.warn('Done!'))
  .catch((e) => console.error('Failed: ', e))
