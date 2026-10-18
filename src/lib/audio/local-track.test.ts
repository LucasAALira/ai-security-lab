import { expect, it } from 'vitest'
import { validateTrack, MAX_TRACK_BYTES } from './local-track'
it('accepts audio with MIME or mobile filename fallback', () => {
  expect(validateTrack(new File(['a'], 'music.mp3'))).toBeNull()
  expect(validateTrack(new File(['a'], 'music', { type: 'audio/mpeg' }))).toBeNull()
})
it('rejects empty and oversized files', () => {
  expect(validateTrack(new File([], 'empty.mp3'))).toContain('vazio')
  const file = new File(['a'], 'large.mp3'); Object.defineProperty(file, 'size', { value: MAX_TRACK_BYTES + 1 })
  expect(validateTrack(file)).toContain('150 MB')
})

it('accepts exactly 150 MB per track', () => {
  expect(MAX_TRACK_BYTES).toBe(150 * 1024 * 1024)
  const file = new File(['a'], 'limit.mp3')
  Object.defineProperty(file, 'size', { value: MAX_TRACK_BYTES })
  expect(validateTrack(file)).toBeNull()
})
