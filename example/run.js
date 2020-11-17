const fluid = require('fluid-music')
const g3rd = require('@fluid-music/g3rd')
const session = new fluid.FluidSession({
  bpm: 64,
  tLibrary: g3rd.tLibrary,
  dLibrary: new Array(10).fill(0).map((_, i) => { return { trimDb: -18 + i*2 } }),
  // d:     '965864965732544',
}, [
  { name: 'g10A' },
])

session.editCursorTime = 1
session.insertScore({
  r:     '1 2 3 4 5 6 7',
  g10A: ['a--bc-h---',
         'a--bc-g---',
         'a--b-ce---', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
})

async function run() {
  await session.saveAsReaperFile('out.RPP')
  await session.saveAsTracktionFile('out.tracktionedit')
}
run()
  .then(() => console.warn('OK'))
  .catch((e) => console.error('Failed: ', e))
