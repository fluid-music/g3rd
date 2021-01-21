# @fluid-music/g3rd

`g3rd` contains collection of guitar dyad (2-note chords) samples packaged for the 
[`fluid-music`](https://www.npmjs.com/package/fluid-music) Node framework. 

It exports 6 different `tLibrary` objects, each of which contains 9 different techniques identified by the lower case symbols: `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`.  

```javascript
modules.exports = {
  // Each tLibrary plays the samples using different technique
  guitar:               { /* a through i */ },
  reverse:              { /* a through i */ },
  reverseLeadIn:        { /* a through i */ },
  // The strech libraries play samples processed by "Paul Stretch"
  stretch:              { /* a through i */ },
  stretchReverse:       { /* a through i */ },
  stretchReverseLeadIn: { /* a through i */ },
}
```

Each dyad is a major or minor 10th in the key of  E Minor. Read [`./guitars.js`](https://github.com/fluid-music/g3rd/blob/main/guitars.js) for more details. 

It's a larger package, ~40 MB unpacked, so only it may download a little slowly. 
