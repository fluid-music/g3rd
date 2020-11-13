const fluid = require('fluid-music')

module.exports = class G3 {
  constructor(options, stretchOptions, notes, stretchCues) {
    if (!Array.isArray(notes)) throw new Error('G3: missing .notes')
    this.notes = notes || []
  
    this.audioFile = new fluid.techniques.AudioFile({
      ...options,
      fadeInSeconds: 0.01,
      fadeOutSeconds: 0.01,
    })
    this.audioFileStretch = new fluid.techniques.AudioFile({
      ...stretchOptions,
      fadeInSeconds: 1.4,
      fadeOutSeconds: 0.01,
      mode: fluid.techniques.AudioFile.Modes.OneVoice,
    })
    this.audioFileStretch.info.cues = stretchCues
  }

  /**
   * @param {UseContext} context
   */
  use(context) {
    this.audioFile.use(context)
    context = { ...context }
    context.track = context.session.getOrCreateTrackByName(context.track.name + '-s')
    this.audioFileStretch.use(context)
  }
}
