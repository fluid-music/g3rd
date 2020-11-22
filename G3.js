const { FluidAudioFile } = require('fluid-music')
const fluid = require('fluid-music')
const { AudioFileMode } = require('fluid-music/built/FluidAudioFile')

module.exports = class G3 {
  constructor(options, stretchOptions, notes, stretchCues) {
    if (!Array.isArray(notes)) throw new Error('G3: missing .notes')
    this.notes = notes || []

    this.audioFile = new fluid.techniques.AudioFile({
      ...options,
      fadeInSeconds: 0.05,
      fadeOutSeconds: 0.01,
      startInSourceSeconds: 0.12,
      mode: fluid.techniques.AudioFile.Modes.OneVoice
    })
    this.audioFileStretch = new fluid.techniques.AudioFile({
      ...stretchOptions,
      fadeInSeconds: .9,
      fadeOutSeconds: .3,
      mode: FluidAudioFile.Modes.OneVoice,
      durationSeconds: stretchCues.release - stretchCues.onset,
    })
    this.audioFileStretch.info.cues = stretchCues
  }

  /**
   * @param {UseContext} context
   */
  use(context) {
    const [base, ext] = context.track.name.split('-')

    if (!ext || ext === 'g') {
      context.track = context.session.getOrCreateTrackByName(base + '-g')
      const audioFile = this.audioFile.use(context)
    }

    if (!ext || ext === 'r') {
      context = { ...context }
      context.track = context.session.getOrCreateTrackByName(base + '-r')

      const audioFile = this.audioFile.use(context)
      // audioFile.startTimeSeconds -= 0.1
      audioFile.startInSourceSeconds += 0.1
      audioFile.fadeInSeconds = 0.1
      audioFile.fadeOutSeconds = 0.1
      audioFile.growRightEdgeBySecondsSafe(0.2)
      audioFile.reverse()
    }

    if (!ext || ext === 's') {
      context = { ...context }
      context.track = context.session.getOrCreateTrackByName(base + '-s')

      const stretchedFile = this.audioFileStretch.use(context)
      stretchedFile.reverse()
      stretchedFile.startInSourceSeconds = stretchedFile.info.cues.release
      // Extend the left edge, but don't extend it more then 2 seconds
      stretchedFile.growLeftEdgeBySecondsSafe(Math.min(2, stretchedFile.getTailLeftSeconds()))
    }
  }
}
