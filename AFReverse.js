
const { techniques, FluidAudioFile } = require('fluid-music')

/**
 * @typedef {import('fluid-music/built/fluid-techniques').AudioFile} AudioFile
 * @typedef {import('fluid-music').UseContext} UseContext
 */

/**
 * AFOnsetRelease encapsulates a `techniques.AudioFile` instance, dividing the
 * underlying source audio file into three regions delimited by `onsetSeconds`
 * and `releaseSeconds`.
 *
 * ```
 *       onsetSeconds    releaseSeconds
 *            |                |
 * |--attack--|------body------|-----decay-----|
 * ```
 *
 * This lightweight abstraction is designed to make it easy to write techniques
 * that align the onset or release of a sample with a musical beat - especially
 * in the case where the sample will be played in reverse.
 */
class AFOnsetRelease {
  /**
   * @param {AudioFile} audioFileTechnique
   * @param {number} [onsetSeconds] The time at which the 'onset' portion of the
   *    sound begins, measured from the start of the source audio file. If not
   *    provided, use the underlying `onset` marker in the source audio file. If
   *    there is no `onset` marker, use 0 (the start of the file)
   * @param {number} [releaseSeconds] The time at which the 'release' portion of
   *    the sound begins, measured from the start of the source audio file. If
   *    not provided, use the `release` marker in the source audio file. If
   *    there is no `release` marker, use the end of the underlying audio file.
   */
  constructor(audioFileTechnique, onsetSeconds, releaseSeconds) {
    this.audioFile = audioFileTechnique
    if (onsetSeconds !== undefined) {
      if (typeof onsetSeconds !== 'number') {
        throw new Error('invalid `onsetSeconds` parameter: ' + onsetSeconds)
      }
      this.audioFile.markers.set('onset', onsetSeconds)
    }
    if(releaseSeconds !== undefined) {
      if (typeof releaseSeconds !== 'number') {
        throw new Error('invalid `releaseSeconds` parameter: ' + releaseSeconds)
      }
      this.audioFile.markers.set('release', releaseSeconds)
    }
  }

  /**
   * Time at which the sample's "body" begins, relative to the start of the
   * source audio file.
   */
  get onsetSeconds () {
    const onset = this.audioFile.markers.get('onset')
    return (typeof onset === 'number') ? onset : 0
  }

  /**
   * Time at which the sample's "decay" begins, relative to the start of the
   * source audio file.
   */
  get releaseSeconds () {
    const release = this.audioFile.markers.get('release')
    return (typeof release === 'number') ? release : this.audioFile.getSourceDurationSeconds()
  }
}

class AFReverse extends AFOnsetRelease {
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

class AFReverseLeadIn extends AFOnsetRelease {
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
