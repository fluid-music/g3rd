
const { techniques, FluidAudioFile } = require('fluid-music')

/**
 * @typedef {import('fluid-music').AudioFileOptions} AudioFileOptions
 * @typedef {import('fluid-music').techniques.AudioFile} AudioFile
 * @typedef {import('fluid-music').UseContext} UseContext
 */

class AudioFileRange {

  /**
   * @param {AudioFile} audioFileTechnique
   */
  constructor(audioFileTechnique) {
    this.audioFile = audioFileTechnique
  }

  get onsetSeconds () {
    const onset = this.audioFile.markers.get('onset')
    return (typeof onset === 'number') ? onset : 0
  }

  get releaseSeconds () {
    const release = this.audioFile.markers.get('release')
    return (typeof release === 'number') ? release : this.audioFile.getSourceDurationSeconds()
  }
}

class AFReverse extends AudioFileRange {
  /**
   * @param {UseContext} context
   */
  use(context) {
    const rxFile = this.audioFile.use(context)
    rxFile.startInSourceSeconds = 0
    rxFile.playToEnd()
    rxFile.reverse(true)

    // distance between onset and event end
    const postOnsetDuration = (rxFile.getSourceDurationSeconds() - this.onsetSeconds) / Math.abs(rxFile.playbackRate)
    const startSecondsDelta = context.durationSeconds - postOnsetDuration
    rxFile.startTimeSeconds += startSecondsDelta

    const desiredDuration = context.durationSeconds + (this.onsetSeconds / Math.abs(rxFile.playbackRate))
    const trimDelta = desiredDuration - rxFile.durationSeconds
    if (trimDelta < 0) rxFile.growLeftEdgeBySecondsSafe(trimDelta)

    rxFile.mode = FluidAudioFile.Modes.Event
    rxFile.fadeInSeconds = Math.max(rxFile.fadeInSeconds, 3.5)
  }
}

class AFReverseLeadIn extends AudioFileRange {
  /**
   * @param {UseContext} context
   */
  use(context) {
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
}

module.exports = {
  AFReverse,
  AFReverseLeadIn,
}
