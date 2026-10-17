import { afterEach, describe, expect, it, vi } from 'vitest'
const native = vi.hoisted(() => ({ enabled: false, write: vi.fn(), share: vi.fn() }))
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => native.enabled } }))
vi.mock('@capacitor/filesystem', () => ({ Filesystem: { writeFile: native.write }, Directory: { Cache: 'CACHE' }, Encoding: { UTF8: 'utf8' } }))
vi.mock('@capacitor/share', () => ({ Share: { share: native.share } }))
import { exportFile } from './export-file'
afterEach(() => { vi.restoreAllMocks(); native.write.mockReset(); native.share.mockReset(); vi.unstubAllGlobals() })
describe('backup export', () => {
  it('shares the native file URI with intact JSON and no storage permission', async () => {
    native.enabled = true
    native.write.mockResolvedValue({ uri: 'file:///cache/backups/progress.json' })
    native.share.mockResolvedValue({})
    expect(await exportFile('progress.json', '{"xp":42}')).toBe('shared')
    expect(native.write).toHaveBeenCalledWith(expect.objectContaining({ data: '{"xp":42}', directory: 'CACHE', path: 'backups/progress.json' }))
    expect(native.share).toHaveBeenCalledWith(expect.objectContaining({ files: ['file:///cache/backups/progress.json'] }))
  })
  it('does not report success when native sharing fails', async () => {
    native.enabled = true
    native.write.mockResolvedValue({ uri: 'file:///cache/progress.json' })
    native.share.mockRejectedValue(new Error('cancelled'))
    await expect(exportFile('progress.json', '{}')).rejects.toThrow('cancelled')
  })
  it('keeps browser downloads without calling native plugins', async () => {
    native.enabled = false
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:backup'), revokeObjectURL: vi.fn() })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    expect(await exportFile('progress.json', '{}')).toBe('downloaded')
    expect(click).toHaveBeenCalledOnce()
    expect(native.write).not.toHaveBeenCalled()
  })
})
