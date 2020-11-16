const fluid = require('fluid-music')
const g3rd = require('@fluid-music/g3rd')
const session = new fluid.FluidSession({
  bpm: 89,
  tLibrary: g3rd.tLibrary,
  dLibrary: new Array(10).fill(0).map((_, i) => { return { trimDb: -18 + i*2 } }),
  // d:     '965864965732544',
}, [
  { name: 'g10A' },
])

session.editCursorTime = 1
session.insertScore({
  r:     '1234',
  g10A: ['a---', 'b---', 'c---', 'd---'],
})

async function run() {
  await session.saveAsReaperFile('out.RPP')
  await session.saveAsTracktionFile('out.tracktionedit')
}
run()
  .then(() => console.warn('OK'))
  .catch((e) => console.error('Failed: ', e))
