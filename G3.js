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
      fadeInSeconds: 0.01,
      fadeOutSeconds: 1.2,
      mode: FluidAudioFile.Modes.Event,
      durationSeconds: stretchCues.release - stretchCues.onset,
    })
    this.audioFileStretch.info.cues = stretchCues
  }

  /**
   * @param {import('fluid-music').UseContext} context
   */
  use(context) {
    const base = context.track.name.slice(0, -1)
    const ext = context.track.name.slice(-1)

    if (!ext || ext === 'g') {
      context.track = context.session.getOrCreateTrackByName(base + 'g')
      const audioFile = this.audioFile.use(context)
    }

    if (!ext || ext === 'r') {
      context = { ...context }
      context.track = context.session.getOrCreateTrackByName(base + 'r')

      const audioFile = this.audioFile.use(context)
      // audioFile.startTimeSeconds -= 0.1
      audioFile.startInSourceSeconds += 0.1
      audioFile.fadeInSeconds = 0.1
      audioFile.fadeOutSeconds = 0.1
      audioFile.growRightEdgeBySecondsSafe(0.2)
      audioFile.reverse()
    }

    // play the stretched audio in reverse, lining up the release with the start
    // of the event. This causes the noisy, un-pitched portion of the sample to
    // act as a 'lead-in' to the event.
    if (!ext || ext === 's') {
      context = { ...context }
      context.track = context.session.getOrCreateTrackByName(base + 's')

      const stretchedFile = this.audioFileStretch.use(context)
      const releaseSeconds = stretchedFile.info.cues.release // within the source file, where does the release begin
      stretchedFile.playToEnd()
      stretchedFile.reverse(true)
      const leadInSeconds = stretchedFile.getSourcePlaybackSeconds() - releaseSeconds
      stretchedFile.startTimeSeconds -= leadInSeconds

      // prevent lead in from being longer than x seconds
      const maxLeadInSeconds = 3.5
      const targetLeadInSeconds = Math.min(maxLeadInSeconds, leadInSeconds)
      if (targetLeadInSeconds !== leadInSeconds) {
        stretchedFile.growLeftEdgeBySeconds(maxLeadInSeconds - leadInSeconds)
      }

      if (stretchedFile.mode === AudioFileMode.Event) {
        stretchedFile.durationSeconds = targetLeadInSeconds + context.durationSeconds
      } else if (stretchedFile.mode === AudioFileMode.OneShot || stretchedFile.mode === AudioFileMode.OneVoice) {
        stretchedFile.playToEnd()
      }
    }

    // Play the stretched audio in reverse, lining up the sound's onset with the
    // end of the event. This is for when you want to set the end of the
    // reversed event to land a particular time.
    if (ext === 'x') {
      context = {...context }
      context.track = context.session.getOrCreateTrackByName(base + 'x')
      const rxFile = this.audioFileStretch.use(context)
      rxFile.mode = FluidAudioFile.Modes.Event
      rxFile.durationSeconds = context.durationSeconds
      rxFile.reverse(true)
      rxFile.growRightEdgeBySeconds(rxFile.getTailRightSeconds())

      rxFile.fadeOutSeconds = 0
      rxFile.fadeInSeconds = Math.max(rxFile.fadeInSeconds, 3)
    }
  }
}
