const { techniques, FluidAudioFile } = require('fluid-music')

/**
 * @typedef {import('fluid-music').AudioFileOptions} AudioFileOptions
 * @typedef {import('fluid-music').UseContext} UseContext
 */

/**
 * RAlign (short for reverse-align)
 */
module.exports = class RAlign {
  /**
   * @param {AudioFileOptions} options
   */
  constructor(options, onsetSeconds = 0, releaseSeconds) {
    console.log(options.info)
    this.audioFile = new techniques.AudioFile(options)
    /** Onset time (within the source file) */
    this.onsetSeconds = onsetSeconds
    /** Release time (within the source file) */
    this.releaseSeconds = releaseSeconds || this.audioFile.getSourceDurationSeconds()
  }

  /** @param {UseContext} context */
  use(context) {
    const base = context.track.name.slice(0, -1)
    const ext = context.track.name.slice(-1)

    // play the stretched audio in reverse, lining up the release with the start
    // of the event. This causes the noisy, un-pitched portion of the sample to
    // act as a 'lead-in' to the event
    if (!ext || ext === 'R') {
      context = { ...context }
      context.track = context.session.getOrCreateTrackByName(base + 'R')
  
      const newFile = this.audioFile.use(context)
      
      newFile.playToEnd()
      newFile.reverse(true)
      const leadInSeconds = newFile.getSourcePlaybackSeconds() - this.releaseSeconds
      newFile.startTimeSeconds -= leadInSeconds
  
      // prevent lead in from being longer than x seconds
      const maxLeadInSeconds = 3.5
      const targetLeadInSeconds = Math.min(maxLeadInSeconds, leadInSeconds)
      if (targetLeadInSeconds !== leadInSeconds) {
        newFile.growLeftEdgeBySeconds(maxLeadInSeconds - leadInSeconds)
      }
  
      if (newFile.mode === FluidAudioFile.Modes.Event) {
        newFile.durationSeconds = targetLeadInSeconds + context.durationSeconds
      } else if (newFile.mode === FluidAudioFile.Modes.OneShot || newFile.mode === FluidAudioFile.Modes.OneVoice) {
        newFile.playToEnd()
      }
    }

    // Play the audio in reverse, lining up the sound's onset with the
    // end of the event. This is for when you want to set the end of the
    // reversed event to land a particular time.
    if (ext === 'X') {
      context = {...context }
      context.track = context.session.getOrCreateTrackByName(base + 'X')
      const rxFile = this.audioFile.use(context)
      rxFile.mode = FluidAudioFile.Modes.Event
      rxFile.durationSeconds = context.durationSeconds
      rxFile.reverse(true)
      rxFile.playToEnd()

      rxFile.fadeOutSeconds = 0
      rxFile.fadeInSeconds = Math.max(rxFile.fadeInSeconds, 3.5)
    }

    return this
  }
}
