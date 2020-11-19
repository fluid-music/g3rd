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
    { name: 'G3-g' },
    { name: 'G3-s' },
    { name: 'G3-r' },
  ]},
])

session.editCursorTime = 7/4
session.insertScore({
  r:       '1 2 3 4 5 6 7 ',
  G3:     ['a--bc-h---',
           'a--bc-g---',
           'a--b-ce---',]
})
session.insertScore({
  'G3-s': ['a--bc-h---']
})
session.insertScore({
  'G3-r': ['a--bc-g---']
})

async function run() {
  await session.saveAsReaperFile('out.RPP')
  console.warn('OK: out.RPP')
  await session.saveAsTracktionFile('out.tracktionedit')
  console.warn('OK: out.tracktionedit')
}
run()
  .then(() => console.warn('Done!'))
  .catch((e) => console.error('Failed: ', e))
