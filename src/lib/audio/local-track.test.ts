import { expect, it } from 'vitest'
import { validateTrack, MAX_TRACK_BYTES } from './local-track'
it('accepts audio with MIME or mobile filename fallback', () => {
  expect(validateTrack(new File(['a'], 'music.mp3'))).toBeNull()
  expect(validateTrack(new File(['a'], 'music', { type: 'audio/mpeg' }))).toBeNull()
})
it('rejects empty and oversized files', () => {
  expect(validateTrack(new File([], 'empty.mp3'))).toContain('vazio')
  const file = new File(['a'], 'large.mp3'); Object.defineProperty(file, 'size', { value: MAX_TRACK_BYTES + 1 })
  expect(validateTrack(file)).toContain('30 MB')
})
